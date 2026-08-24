import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# Em um ambiente real, usamos variáveis de ambiente via Pydantic BaseSettings (ex: pydantic-settings)
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://postgres:postgres@localhost:5432/test_boti"
)

# Criação da Engine Assíncrona. 
# pool_pre_ping=True verifica a conexão antes de usá-la, evitando erros de "MySQL server has gone away" ou similares no Postgres
engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

# Factory de sessões
async_session_maker = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False, autoflush=False
)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency Injection function for FastAPI routes.
    Garante que a sessão do banco seja fechada após o request.
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
