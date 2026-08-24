from typing import List, Optional
from app.domain.entities import MovieCategory
from app.application.interfaces.movie_category_repository import IMovieCategoryRepository

class CreateCategoryUseCase:
    def __init__(self, repository: IMovieCategoryRepository):
        self.repository = repository
        
    async def execute(self, name: str, description: Optional[str] = None) -> MovieCategory:
        # Aqui entram validações de negócio, ex: verificar se categoria já existe (se tivéssemos esse método no repo)
        category = MovieCategory(name=name, description=description)
        return await self.repository.create(category)

class ListCategoriesUseCase:
    def __init__(self, repository: IMovieCategoryRepository):
        self.repository = repository
        
    async def execute(self) -> List[MovieCategory]:
        return await self.repository.list_all()

class GetCategoryUseCase:
    def __init__(self, repository: IMovieCategoryRepository):
        self.repository = repository
        
    async def execute(self, category_id: int) -> Optional[MovieCategory]:
        return await self.repository.get_by_id(category_id)
