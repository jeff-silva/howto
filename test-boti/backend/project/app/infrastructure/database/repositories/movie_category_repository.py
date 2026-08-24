from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities import MovieCategory
from app.application.interfaces.movie_category_repository import IMovieCategoryRepository
from app.infrastructure.database.models.movie_category import MovieCategoryModel

class SQLAlchemyMovieCategoryRepository(IMovieCategoryRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, category: MovieCategory) -> MovieCategory:
        db_category = MovieCategoryModel(
            name=category.name,
            description=category.description
        )
        self.session.add(db_category)
        await self.session.commit()
        await self.session.refresh(db_category)
        
        category.id = db_category.id
        category.created_at = db_category.created_at
        return category

    async def get_by_id(self, category_id: int) -> Optional[MovieCategory]:
        result = await self.session.execute(select(MovieCategoryModel).filter(MovieCategoryModel.id == category_id))
        db_category = result.scalar_one_or_none()
        
        if not db_category:
            return None
            
        return MovieCategory(
            id=db_category.id,
            name=db_category.name,
            description=db_category.description,
            created_at=db_category.created_at
        )

    async def list_all(self) -> List[MovieCategory]:
        result = await self.session.execute(select(MovieCategoryModel))
        db_categories = result.scalars().all()
        
        return [
            MovieCategory(
                id=c.id,
                name=c.name,
                description=c.description,
                created_at=c.created_at
            ) for c in db_categories
        ]

    async def delete(self, category_id: int) -> bool:
        db_category = await self.session.get(MovieCategoryModel, category_id)
        if not db_category:
            return False
        
        await self.session.delete(db_category)
        await self.session.commit()
        return True
