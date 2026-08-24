from typing import List, Optional
from app.domain.entities import MovieCatalog
from app.application.interfaces.movie_catalog_repository import IMovieCatalogRepository
from app.presentation.schemas.pagination_schema import PaginatedResponse

class MovieCatalogCreateUseCase:
    def __init__(self, repository: IMovieCatalogRepository):
        self.repository = repository
        
    async def execute(self, title: str, category_id: int, description: Optional[str] = None, release_year: Optional[int] = None) -> MovieCatalog:
        movie = MovieCatalog(
            title=title, 
            description=description, 
            release_year=release_year, 
            category_id=category_id
        )
        return await self.repository.create(movie)

class MovieCatalogSearchUseCase:
    def __init__(self, repository: IMovieCatalogRepository):
        self.repository = repository
        
    async def execute(self, page: int = 1, per_page: int = 10, search: Optional[str] = None) -> PaginatedResponse[MovieCatalog]:
        skip = (page - 1) * per_page
        items, total = await self.repository.search(skip=skip, limit=per_page, search=search)
        return PaginatedResponse.create(items=items, total=total, page=page, per_page=per_page)

class MovieCatalogGetUseCase:
    def __init__(self, repository: IMovieCatalogRepository):
        self.repository = repository
        
    async def execute(self, movie_id: int) -> Optional[MovieCatalog]:
        return await self.repository.get_by_id(movie_id)
