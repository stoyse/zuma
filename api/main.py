from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.stripe import router as stripe_router  # Import Stripe router
from routes.ai import router as ai_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins (development only!)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(stripe_router, prefix="/stripe")  # Include Stripe router
app.include_router(ai_router, prefix="/ai")

@app.get("/")
def read_root():
    return {"message": "Hello, Zuma!"}

