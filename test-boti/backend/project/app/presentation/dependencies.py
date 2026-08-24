from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.session import async_session_maker
from app.infrastructure.database.repositories.movie_category_repository import SQLAlchemyMovieCategoryRepository
from app.infrastructure.database.repositories.movie_catalog_repository import SQLAlchemyMovieCatalogRepository

from app.application.use_cases.category_use_cases import CreateCategoryUseCase, ListCategoriesUseCase, GetCategoryUseCase
from app.application.use_cases.catalog_use_cases import CreateMovieUseCase, ListMoviesUseCase, GetMovieUseCase

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

def get_category_repository(session: AsyncSession) -> SQLAlchemyMovieCategoryRepository:
    return SQLAlchemyMovieCategoryRepository(session)

def get_catalog_repository(session: AsyncSession) -> SQLAlchemyMovieCatalogRepository:
    return SQLAlchemyMovieCatalogRepository(session)

# Dependências para injetar os Casos de Uso diretamente nos endpoints

def get_create_category_use_case(session: AsyncSession) -> CreateCategoryUseCase:
    return CreateCategoryUseCase(get_category_repository(session))

def get_list_categories_use_case(session: AsyncSession) -> ListCategoriesUseCase:
    return ListCategoriesUseCase(get_category_repository(session))

def get_create_movie_use_case(session: AsyncSession) -> CreateMovieUseCase:
    return CreateMovieUseCase(get_catalog_repository(session))

def get_list_movies_use_case(session: AsyncSession) -> ListMoviesUseCase:
    return ListMoviesUseCase(get_catalog_repository(session))
