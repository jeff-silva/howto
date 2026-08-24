import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_movie_category_create_success(client: AsyncClient):
    payload = {
        "name": "Ficção Científica",
        "description": "Filmes que exploram ciência"
    }
    
    # Chama o endpoint POST
    response = await client.post("/movie_category/", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "Ficção Científica"
    assert data["description"] == "Filmes que exploram ciência"
    assert "created_at" in data

@pytest.mark.asyncio
async def test_movie_category_list_empty(client: AsyncClient):
    # Chama o endpoint GET sem ter inserido nada
    response = await client.get("/movie_category/")
    
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) == 0
    assert data["total"] == 0

@pytest.mark.asyncio
async def test_movie_category_create_and_list(client: AsyncClient):
    # Insere uma categoria
    await client.post("/movie_category/", json={"name": "Ação"})
    
    # Busca a lista
    response = await client.get("/movie_category/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "Ação"

@pytest.mark.asyncio
async def test_movie_category_delete_success(client: AsyncClient):
    # Insere
    await client.post("/movie_category/", json={"name": "Delete Me"})
    
    # Deleta
    response = await client.delete("/movie_category/1")
    assert response.status_code == 204
    
    # Verifica se sumiu
    get_response = await client.get("/movie_category/")
    assert get_response.json()["total"] == 0

@pytest.mark.asyncio
async def test_movie_category_delete_with_movies_fails(client: AsyncClient):
    # Insere Categoria e Filme
    await client.post("/movie_category/", json={"name": "Drama"})
    await client.post("/movie_catalog/", json={"title": "Joker", "category_id": 1})
    
    # Tenta deletar
    response = await client.delete("/movie_category/1")
    assert response.status_code == 400
    assert "Não é possível deletar uma categoria que possui filmes atrelados" in response.json()["detail"]
