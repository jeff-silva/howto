from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

@dataclass
class MovieCatalog:
    title: str
    category_id: int
    description: Optional[str] = None
    release_year: Optional[int] = None
    id: Optional[int] = None
    created_at: datetime = field(default_factory=datetime.now)
