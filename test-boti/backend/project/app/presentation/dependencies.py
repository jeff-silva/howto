from fastapi import Depends
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.session import async_session_maker
from app.infrastructure.database.repositories.movie_category_repository import SQLAlchemyMovieCategoryRepository
from app.infrastructure.database.repositories.movie_catalog_repository import SQLAlchemyMovieCatalogRepository

from app.application.use_cases.movie_category_use_cases import MovieCategoryCreateUseCase, MovieCategorySearchUseCase, MovieCategoryGetUseCase, MovieCategoryDeleteUseCase
from app.application.use_cases.movie_catalog_use_cases import MovieCatalogCreateUseCase, MovieCatalogSearchUseCase, MovieCatalogGetUseCase
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

def get_movie_category_create_use_case(repo: IMovieCategoryRepository = Depends(get_category_repository)) -> MovieCategoryCreateUseCase:
    return MovieCategoryCreateUseCase(repo)

def get_movie_category_search_use_case(repo: IMovieCategoryRepository = Depends(get_category_repository)) -> MovieCategorySearchUseCase:
    return MovieCategorySearchUseCase(repo)

def get_movie_catalog_create_use_case(repo: IMovieCatalogRepository = Depends(get_catalog_repository)) -> MovieCatalogCreateUseCase:
    return MovieCatalogCreateUseCase(repo)

def get_movie_catalog_search_use_case(repo: IMovieCatalogRepository = Depends(get_catalog_repository)) -> MovieCatalogSearchUseCase:
    return MovieCatalogSearchUseCase(repo)

def get_movie_category_delete_use_case(
    category_repo: IMovieCategoryRepository = Depends(get_category_repository),
    catalog_repo: IMovieCatalogRepository = Depends(get_catalog_repository)
) -> MovieCategoryDeleteUseCase:
    return MovieCategoryDeleteUseCase(category_repo, catalog_repo)
