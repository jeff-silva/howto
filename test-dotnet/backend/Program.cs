using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Configuração do Redis usando a string de conexão das variáveis de ambiente (Docker Compose)
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "PokedexAPI_";
});

// Configuração do HttpClient para fazer requisições para a API Externa
builder.Services.AddHttpClient("ExternalAPI", client =>
{
    client.BaseAddress = new Uri("https://dummyjson.com/");
});

// Permite que nosso frontend (em outra porta) consiga fazer requisições
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

app.MapGet("/", () => "Bem-vindo! Rotas disponíveis: GET /product/{nome}, GET /favorites, POST /favorites, PUT /favorites/{nome}, DELETE /favorites/{nome}");

// GET /product/{nome} - Busca na API Externa com Redis Cache
app.MapGet("/product/{nome}", async (string nome, IHttpClientFactory httpClientFactory, IDistributedCache cache) =>
{
    nome = nome.ToLower();
    string cacheKey = $"product:{nome}";

    // Tenta pegar do Redis primeiro
    var cached = await cache.GetStringAsync(cacheKey);
    if (!string.IsNullOrEmpty(cached))
    {
        // Se já está no cache, devolvemos um header para você ver que veio do Redis!
        return Results.Ok(new { FromCache = true, Data = JsonSerializer.Deserialize<object>(cached) });
    }

    // Se não está no Redis, busca na API externa
    var client = httpClientFactory.CreateClient("ExternalAPI");
    var response = await client.GetAsync($"products/search?q={nome}");

    if (!response.IsSuccessStatusCode)
    {
        return Results.NotFound(new { Message = "Produto não encontrado!" });
    }

    var data = await response.Content.ReadAsStringAsync();

    // Salva no Redis com tempo de expiração de 1 hora
    var cacheOptions = new DistributedCacheEntryOptions
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
    };
    await cache.SetStringAsync(cacheKey, data, cacheOptions);

    return Results.Ok(new { FromCache = false, Data = JsonSerializer.Deserialize<object>(data) });
});

// Métodos auxiliares para gerenciar a lista de favoritos no Redis
async Task<List<FavoriteProduct>> GetFavoritesAsync(IDistributedCache cache)
{
    var data = await cache.GetStringAsync("favorites");
    return string.IsNullOrEmpty(data) ? new List<FavoriteProduct>() : JsonSerializer.Deserialize<List<FavoriteProduct>>(data)!;
}

async Task SaveFavoritesAsync(IDistributedCache cache, List<FavoriteProduct> favorites)
{
    await cache.SetStringAsync("favorites", JsonSerializer.Serialize(favorites));
}

// GET /favorites
app.MapGet("/favorites", async (IDistributedCache cache) =>
{
    var favorites = await GetFavoritesAsync(cache);
    return Results.Ok(favorites);
});

// POST /favorites
app.MapPost("/favorites", async (FavoriteProduct newFavorite, IDistributedCache cache) =>
{
    var favorites = await GetFavoritesAsync(cache);
    
    if (favorites.Any(f => f.Name.Equals(newFavorite.Name, StringComparison.OrdinalIgnoreCase)))
    {
        return Results.BadRequest("Produto já está nos favoritos!");
    }

    favorites.Add(newFavorite);
    await SaveFavoritesAsync(cache, favorites);

    return Results.Created($"/favorites", newFavorite);
});

// PUT /favorites/{nome}
app.MapPut("/favorites/{nome}", async (string nome, FavoriteProduct updatedFavorite, IDistributedCache cache) =>
{
    var favorites = await GetFavoritesAsync(cache);
    var index = favorites.FindIndex(f => f.Name.Equals(nome, StringComparison.OrdinalIgnoreCase));
    
    if (index == -1)
    {
        return Results.NotFound("Produto favorito não encontrado!");
    }

    // Impede a mudança do nome na edição
    updatedFavorite.Name = favorites[index].Name; 
    favorites[index] = updatedFavorite;
    await SaveFavoritesAsync(cache, favorites);

    return Results.Ok(updatedFavorite);
});

// DELETE /favorites/{nome}
app.MapDelete("/favorites/{nome}", async (string nome, IDistributedCache cache) =>
{
    var favorites = await GetFavoritesAsync(cache);
    var index = favorites.FindIndex(f => f.Name.Equals(nome, StringComparison.OrdinalIgnoreCase));
    
    if (index == -1)
    {
        return Results.NotFound("Produto favorito não encontrado!");
    }

    favorites.RemoveAt(index);
    await SaveFavoritesAsync(cache, favorites);

    return Results.NoContent();
});

app.Run();

// Classe de modelo que define o formato de um Produto Favorito
public class FavoriteProduct
{
    public string Name { get; set; } = string.Empty;
    public string Nickname { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
}
