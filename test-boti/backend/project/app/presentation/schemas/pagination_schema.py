from typing import Generic, TypeVar, List
from pydantic import BaseModel
import math

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    per_page: int
    total_pages: int

    @classmethod
    def create(cls, items: List[T], total: int, page: int, per_page: int):
        total_pages = math.ceil(total / per_page) if per_page > 0 else 0
        return cls(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
