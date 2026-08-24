from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from .base import Base

if TYPE_CHECKING:
    from .movie_category import MovieCategoryModel

class MovieCatalogModel(Base):
    __tablename__ = "movie_catalog"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    release_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("movie_category.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relacionamento N para 1 com a categoria
    category: Mapped["MovieCategoryModel"] = relationship(back_populates="movies")
