from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.presentation.schemas.movie_catalog_schemas import MovieCreate, MovieResponse
from app.presentation.dependencies import get_create_movie_use_case, get_list_movies_use_case
from app.application.use_cases.movie_catalog_use_cases import CreateMovieUseCase, ListMoviesUseCase

router = APIRouter(prefix="/movie_catalog", tags=["Movie Catalog"])

@router.post("/", response_model=MovieResponse, status_code=201)
async def create_movie(
    movie_in: MovieCreate,
    use_case: CreateMovieUseCase = Depends(get_create_movie_use_case)
):
    movie = await use_case.execute(
        title=movie_in.title,
        category_id=movie_in.category_id,
        description=movie_in.description,
        release_year=movie_in.release_year
    )
    return movie

@router.get("/", response_model=List[MovieResponse])
async def list_movies(
    use_case: ListMoviesUseCase = Depends(get_list_movies_use_case)
):
    movies = await use_case.execute()
    return movies
