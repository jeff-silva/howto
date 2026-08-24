from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities import MovieCatalog
from app.application.interfaces.movie_catalog_repository import IMovieCatalogRepository
from app.infrastructure.database.models.movie_catalog import MovieCatalogModel

class SQLAlchemyMovieCatalogRepository(IMovieCatalogRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, catalog: MovieCatalog) -> MovieCatalog:
        db_catalog = MovieCatalogModel(
            title=catalog.title,
            description=catalog.description,
            release_year=catalog.release_year,
            category_id=catalog.category_id
        )
        self.session.add(db_catalog)
        await self.session.commit()
        await self.session.refresh(db_catalog)
        
        catalog.id = db_catalog.id
        catalog.created_at = db_catalog.created_at
        return catalog

    async def get_by_id(self, catalog_id: int) -> Optional[MovieCatalog]:
        result = await self.session.execute(select(MovieCatalogModel).filter(MovieCatalogModel.id == catalog_id))
        db_catalog = result.scalar_one_or_none()
        
        if not db_catalog:
            return None
            
        return MovieCatalog(
            id=db_catalog.id,
            title=db_catalog.title,
            description=db_catalog.description,
            release_year=db_catalog.release_year,
            category_id=db_catalog.category_id,
            created_at=db_catalog.created_at
        )

    async def list_all(self) -> List[MovieCatalog]:
        result = await self.session.execute(select(MovieCatalogModel))
        db_catalogs = result.scalars().all()
        
        return [
            MovieCatalog(
                id=c.id,
                title=c.title,
                description=c.description,
                release_year=c.release_year,
                category_id=c.category_id,
                created_at=c.created_at
            ) for c in db_catalogs
        ]

    async def delete(self, catalog_id: int) -> bool:
        db_catalog = await self.session.get(MovieCatalogModel, catalog_id)
        if not db_catalog:
            return False
        
        await self.session.delete(db_catalog)
        await self.session.commit()
        return True
