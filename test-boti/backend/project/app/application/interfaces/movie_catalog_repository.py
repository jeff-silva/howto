from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.entities import MovieCatalog

class IMovieCatalogRepository(ABC):
    @abstractmethod
    async def create(self, catalog: MovieCatalog) -> MovieCatalog:
        pass

    @abstractmethod
    async def get_by_id(self, catalog_id: int) -> Optional[MovieCatalog]:
        pass

    @abstractmethod
    async def search(self, skip: int = 0, limit: int = 10, search: str | None = None) -> tuple[list[MovieCatalog], int]:
        pass

    @abstractmethod
    async def has_movies_by_category(self, category_id: int) -> bool:
        pass

    @abstractmethod
    async def delete(self, catalog_id: int) -> bool:
        pass
