import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_movie_catalog_create_success(client: AsyncClient):
    payload = {
        "title": "Matrix",
        "category_id": 1,
        "description": "Filme clássico",
        "release_year": 1999
    }
    
    # Chama o endpoint POST
    response = await client.post("/movie_catalog/", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "Matrix"
    assert data["category_id"] == 1
    assert "created_at" in data

@pytest.mark.asyncio
async def test_movie_catalog_list_empty(client: AsyncClient):
    # Chama o endpoint GET sem ter inserido nada
    response = await client.get("/movie_catalog/")
    
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) == 0
    assert data["total"] == 0

@pytest.mark.asyncio
async def test_movie_catalog_create_and_list(client: AsyncClient):
    # Insere um filme no catálogo
    await client.post("/movie_catalog/", json={"title": "Inception", "category_id": 2})
    
    # Busca a lista
    response = await client.get("/movie_catalog/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Inception"
    assert data["items"][0]["category_id"] == 2
