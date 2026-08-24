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

    async def search(self, skip: int = 0, limit: int = 10, search: str | None = None) -> tuple[list[MovieCategory], int]:
        from sqlalchemy import func
        
        base_query = select(MovieCategoryModel)
        count_query = select(func.count()).select_from(MovieCategoryModel)
        
        if search:
            condition = MovieCategoryModel.name.ilike(f"%{search}%")
            base_query = base_query.where(condition)
            count_query = count_query.where(condition)
            
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()
        
        query = base_query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        models = result.scalars().all()
        
        return [
            MovieCategory(
                id=m.id, 
                name=m.name, 
                description=m.description, 
                created_at=m.created_at
            ) for m in models
        ], total

    async def delete(self, category_id: int) -> bool:
        db_category = await self.session.get(MovieCategoryModel, category_id)
        if not db_category:
            return False
        
        await self.session.delete(db_category)
        await self.session.commit()
        return True
