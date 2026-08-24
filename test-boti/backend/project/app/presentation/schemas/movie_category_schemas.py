from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MovieCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class MovieCategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
