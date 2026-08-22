from fastapi import FastAPI

app = FastAPI(title="Test Boti API")

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Test Boti!"}
