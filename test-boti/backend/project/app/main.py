from fastapi import FastAPI
from app.presentation.routers import movie_category, movie_catalog, random_user

app = FastAPI(title="Test Boti API")

app.include_router(movie_category.router)
app.include_router(movie_catalog.router)
app.include_router(random_user.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Test Boti!"}
