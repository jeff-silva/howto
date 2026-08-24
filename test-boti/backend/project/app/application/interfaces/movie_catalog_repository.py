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
    async def list_all(self) -> List[MovieCatalog]:
        pass

    @abstractmethod
    async def delete(self, catalog_id: int) -> bool:
        pass
