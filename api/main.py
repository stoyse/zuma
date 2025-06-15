from fastapi import FastAPI
from routes.auth import router as auth_router

app = FastAPI()

app.include_router(auth_router, prefix="/auth")

@app.get("/")
def read_root():
    return {"message": "Hello, Zuma!"}

