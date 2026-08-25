from fastapi import APIRouter, HTTPException
import httpx

# Se você instalar a biblioteca padrão da comunidade (pip install fastapi-cache2)
# Você importaria o decorator assim:
# from fastapi_cache.decorator import cache

router = APIRouter(prefix="/random-users", tags=["Random Users"])

@router.get("/")
# @cache(expire=60)  <-- É LITERALMENTE SÓ ADICIONAR ESSA LINHA!
async def get_random_users(results: int = 10):
    """
    Exemplo limpo usando a biblioteca 'fastapi-cache2'.
    Toda a lógica gigante de dicionário e TTL é resolvida por um único decorator.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://randomuser.me/api/?results={results}", timeout=5.0)
            response.raise_for_status()
            
            # Com o @cache, o FastAPI-cache intercepta esse return. 
            # Na próxima vez, ele nem entra na função, já devolve direto da memória ou Redis.
            return {"source": "api", "data": response.json()["results"]}
            
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=502, 
            detail=f"Falha na comunicação com API externa: {str(e)}"
        )
