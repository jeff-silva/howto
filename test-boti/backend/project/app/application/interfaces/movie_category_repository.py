from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.entities import MovieCategory

class IMovieCategoryRepository(ABC):
    @abstractmethod
    async def create(self, category: MovieCategory) -> MovieCategory:
        pass

    @abstractmethod
    async def get_by_id(self, category_id: int) -> Optional[MovieCategory]:
        pass

    @abstractmethod
    async def search(self, skip: int = 0, limit: int = 10, search: str | None = None) -> tuple[list[MovieCategory], int]:
        pass

    @abstractmethod
    async def delete(self, category_id: int) -> bool:
        pass
