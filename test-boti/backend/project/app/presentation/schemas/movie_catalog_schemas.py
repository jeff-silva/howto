from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MovieCatalogCreate(BaseModel):
    title: str
    category_id: int
    description: Optional[str] = None
    release_year: Optional[int] = None

class MovieCatalogResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    release_year: Optional[int]
    category_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
