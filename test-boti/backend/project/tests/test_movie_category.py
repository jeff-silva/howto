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
