from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.presentation.schemas.movie_category_schemas import CategoryCreate, CategoryResponse
from app.presentation.dependencies import get_db_session, get_create_category_use_case, get_list_categories_use_case
from app.application.use_cases.category_use_cases import CreateCategoryUseCase, ListCategoriesUseCase

router = APIRouter(prefix="/movie_category", tags=["Movie Category"])

@router.post("/", response_model=CategoryResponse, status_code=201)
async def create_category(
    category_in: CategoryCreate,
    session: AsyncSession = Depends(get_db_session)
):
    use_case = get_create_category_use_case(session)
    category = await use_case.execute(name=category_in.name, description=category_in.description)
    return category

@router.get("/", response_model=List[CategoryResponse])
async def list_categories(session: AsyncSession = Depends(get_db_session)):
    use_case = get_list_categories_use_case(session)
    categories = await use_case.execute()
    return categories
