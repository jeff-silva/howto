from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.presentation.schemas.pagination_schema import PaginatedResponse

from app.presentation.schemas.movie_catalog_schemas import MovieCatalogCreate, MovieCatalogResponse
from app.presentation.dependencies import get_movie_catalog_create_use_case, get_movie_catalog_search_use_case
from app.application.use_cases.movie_catalog_use_cases import MovieCatalogCreateUseCase, MovieCatalogSearchUseCase

router = APIRouter(prefix="/movie_catalog", tags=["Movie Catalog"])

@router.post("/", response_model=MovieCatalogResponse, status_code=201)
async def create_movie(
    movie_in: MovieCatalogCreate,
    use_case: MovieCatalogCreateUseCase = Depends(get_movie_catalog_create_use_case)
):
    movie = await use_case.execute(
        title=movie_in.title,
        category_id=movie_in.category_id,
        description=movie_in.description,
        release_year=movie_in.release_year
    )
    return movie

@router.get("/", response_model=PaginatedResponse[MovieCatalogResponse])
async def list_movies(
    page: int = 1,
    per_page: int = 10,
    search: Optional[str] = None,
    use_case: MovieCatalogSearchUseCase = Depends(get_movie_catalog_search_use_case)
):
    movies = await use_case.execute(page=page, per_page=per_page, search=search)
    return movies
