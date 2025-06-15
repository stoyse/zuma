from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.stripe import router as stripe_router  # Stripe-Router importieren

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # oder ["*"] für alle Origins (nur für Entwicklung!)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(stripe_router, prefix="/stripe")  # Stripe-Router einbinden

@app.get("/")
def read_root():
    return {"message": "Hello, Zuma!"}

