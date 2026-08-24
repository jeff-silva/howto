from fastapi import FastAPI
from app.presentation.routers import movie_category, movie_catalog

app = FastAPI(title="Test Boti API")

app.include_router(movie_category.router)
app.include_router(movie_catalog.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Test Boti!"}
