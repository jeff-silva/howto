from fastapi import Depends
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.session import async_session_maker
from app.infrastructure.database.repositories.movie_category_repository import SQLAlchemyMovieCategoryRepository
from app.infrastructure.database.repositories.movie_catalog_repository import SQLAlchemyMovieCatalogRepository

from app.application.use_cases.movie_category_use_cases import CreateCategoryUseCase, ListCategoriesUseCase, GetCategoryUseCase
from app.application.use_cases.movie_catalog_use_cases import CreateMovieUseCase, ListMoviesUseCase, GetMovieUseCase
from app.application.interfaces.movie_category_repository import IMovieCategoryRepository
from app.application.interfaces.movie_catalog_repository import IMovieCatalogRepository

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

def get_category_repository(session: AsyncSession = Depends(get_db_session)) -> IMovieCategoryRepository:
    return SQLAlchemyMovieCategoryRepository(session)

def get_catalog_repository(session: AsyncSession = Depends(get_db_session)) -> IMovieCatalogRepository:
    return SQLAlchemyMovieCatalogRepository(session)

# Dependências para injetar os Casos de Uso diretamente nos endpoints

def get_create_category_use_case(repo: IMovieCategoryRepository = Depends(get_category_repository)) -> CreateCategoryUseCase:
    return CreateCategoryUseCase(repo)

def get_list_categories_use_case(repo: IMovieCategoryRepository = Depends(get_category_repository)) -> ListCategoriesUseCase:
    return ListCategoriesUseCase(repo)

def get_create_movie_use_case(repo: IMovieCatalogRepository = Depends(get_catalog_repository)) -> CreateMovieUseCase:
    return CreateMovieUseCase(repo)

def get_list_movies_use_case(repo: IMovieCatalogRepository = Depends(get_catalog_repository)) -> ListMoviesUseCase:
    return ListMoviesUseCase(repo)
