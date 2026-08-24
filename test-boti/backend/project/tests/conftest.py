import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from typing import AsyncGenerator

from app.main import app
from app.presentation.dependencies import get_category_repository, get_db_session
from app.domain.entities import MovieCategory
from app.application.interfaces.movie_category_repository import IMovieCategoryRepository

# --- Mocks ---

class MockCategoryRepository(IMovieCategoryRepository):
    def __init__(self):
        self.categories = {}
        self.counter = 1

    async def create(self, category: MovieCategory) -> MovieCategory:
        category.id = self.counter
        self.categories[self.counter] = category
        self.counter += 1
        return category

    async def get_by_id(self, category_id: int) -> MovieCategory | None:
        return self.categories.get(category_id)

    async def search(self, skip: int = 0, limit: int = 10, search: str | None = None) -> tuple[list[MovieCategory], int]:
        items = list(self.categories.values())
        if search:
            items = [i for i in items if search.lower() in i.name.lower()]
        total = len(items)
        return items[skip:skip+limit], total

    async def delete(self, category_id: int) -> bool:
        if category_id in self.categories:
            del self.categories[category_id]
            return True
        return False

# --- Fixtures ---

@pytest.fixture
def mock_repo():
    return MockCategoryRepository()

from app.application.interfaces.movie_catalog_repository import IMovieCatalogRepository
from app.domain.entities import MovieCatalog
from app.presentation.dependencies import get_catalog_repository

class MockCatalogRepository(IMovieCatalogRepository):
    def __init__(self):
        self.catalogs = {}
        self.counter = 1

    async def create(self, catalog: MovieCatalog) -> MovieCatalog:
        catalog.id = self.counter
        self.catalogs[self.counter] = catalog
        self.counter += 1
        return catalog

    async def get_by_id(self, catalog_id: int) -> MovieCatalog | None:
        return self.catalogs.get(catalog_id)

    async def search(self, skip: int = 0, limit: int = 10, search: str | None = None) -> tuple[list[MovieCatalog], int]:
        items = list(self.catalogs.values())
        if search:
            items = [i for i in items if search.lower() in i.title.lower()]
        total = len(items)
        return items[skip:skip+limit], total

    async def delete(self, catalog_id: int) -> bool:
        if catalog_id in self.catalogs:
            del self.catalogs[catalog_id]
            return True
        return False

    async def has_movies_by_category(self, category_id: int) -> bool:
        for movie in self.catalogs.values():
            if movie.category_id == category_id:
                return True
        return False

@pytest.fixture
def mock_catalog_repo():
    return MockCatalogRepository()

@pytest_asyncio.fixture
async def client(mock_repo, mock_catalog_repo) -> AsyncGenerator[AsyncClient, None]:
    # Aqui fazemos o override das dependências para injetar nossos Mocks!
    app.dependency_overrides[get_category_repository] = lambda: mock_repo
    app.dependency_overrides[get_catalog_repository] = lambda: mock_catalog_repo
    
    # Criamos um cliente HTTP assíncrono apontando para o nosso app
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver"
    ) as ac:
        yield ac
        
    # Limpamos os overrides após o teste
    app.dependency_overrides.clear()
