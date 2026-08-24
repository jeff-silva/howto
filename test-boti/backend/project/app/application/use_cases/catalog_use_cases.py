from typing import List, Optional
from app.domain.entities import MovieCatalog
from app.application.interfaces.movie_catalog_repository import IMovieCatalogRepository

class CreateMovieUseCase:
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

class ListMoviesUseCase:
    def __init__(self, repository: IMovieCatalogRepository):
        self.repository = repository
        
    async def execute(self) -> List[MovieCatalog]:
        return await self.repository.list_all()

class GetMovieUseCase:
    def __init__(self, repository: IMovieCatalogRepository):
        self.repository = repository
        
    async def execute(self, movie_id: int) -> Optional[MovieCatalog]:
        return await self.repository.get_by_id(movie_id)
