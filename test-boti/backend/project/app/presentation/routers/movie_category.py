from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.presentation.schemas.pagination_schema import PaginatedResponse

from app.presentation.schemas.movie_category_schemas import MovieCategoryCreate, MovieCategoryResponse
from app.presentation.dependencies import get_movie_category_create_use_case, get_movie_category_search_use_case
from app.application.use_cases.movie_category_use_cases import MovieCategoryCreateUseCase, MovieCategorySearchUseCase

router = APIRouter(prefix="/movie_category", tags=["Movie Category"])

@router.post("/", response_model=MovieCategoryResponse, status_code=201)
async def create_category(
    category_in: MovieCategoryCreate,
    use_case: MovieCategoryCreateUseCase = Depends(get_movie_category_create_use_case)
):
    category = await use_case.execute(name=category_in.name, description=category_in.description)
    return category

@router.get("/", response_model=PaginatedResponse[MovieCategoryResponse])
async def list_categories(
    page: int = 1,
    per_page: int = 10,
    search: Optional[str] = None,
    use_case: MovieCategorySearchUseCase = Depends(get_movie_category_search_use_case)
):
    categories = await use_case.execute(page=page, per_page=per_page, search=search)
    return categories
