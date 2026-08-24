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

    async def search(self, skip: int = 0, limit: int = 10, search: str | None = None) -> tuple[list[MovieCatalog], int]:
        from sqlalchemy import func
        
        base_query = select(MovieCatalogModel)
        count_query = select(func.count()).select_from(MovieCatalogModel)
        
        if search:
            condition = MovieCatalogModel.title.ilike(f"%{search}%")
            base_query = base_query.where(condition)
            count_query = count_query.where(condition)
            
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()
        
        query = base_query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        models = result.scalars().all()
        
        return [
            MovieCatalog(
                id=m.id, 
                title=m.title, 
                category_id=m.category_id,
                description=m.description, 
                release_year=m.release_year,
                created_at=m.created_at
            ) for m in models
        ], total

    async def delete(self, catalog_id: int) -> bool:
        db_catalog = await self.session.get(MovieCatalogModel, catalog_id)
        if not db_catalog:
            return False
        
        await self.session.delete(db_catalog)
        await self.session.commit()
        return True
