from typing import List, Optional
from app.domain.entities import MovieCategory
from app.application.interfaces.movie_category_repository import IMovieCategoryRepository
from app.presentation.schemas.pagination_schema import PaginatedResponse

class MovieCategoryCreateUseCase:
    def __init__(self, repository: IMovieCategoryRepository):
        self.repository = repository
        
    async def execute(self, name: str, description: Optional[str] = None) -> MovieCategory:
        # Aqui entram validações de negócio, ex: verificar se categoria já existe (se tivéssemos esse método no repo)
        category = MovieCategory(name=name, description=description)
        return await self.repository.create(category)

class MovieCategorySearchUseCase:
    def __init__(self, repository: IMovieCategoryRepository):
        self.repository = repository
        
    async def execute(self, page: int = 1, per_page: int = 10, search: Optional[str] = None) -> PaginatedResponse[MovieCategory]:
        skip = (page - 1) * per_page
        items, total = await self.repository.search(skip=skip, limit=per_page, search=search)
        return PaginatedResponse.create(items=items, total=total, page=page, per_page=per_page)

class MovieCategoryGetUseCase:
    def __init__(self, repository: IMovieCategoryRepository):
        self.repository = repository
        
    async def execute(self, category_id: int) -> Optional[MovieCategory]:
        return await self.repository.get_by_id(category_id)
