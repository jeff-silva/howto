from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

@dataclass
class MovieCategory:
    name: str
    description: Optional[str] = None
    id: Optional[int] = None
    created_at: datetime = field(default_factory=datetime.now)
