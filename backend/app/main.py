from app.routes.system import router as system_router
from app.routes.model import router as model_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DDoS Detection API", version="1.0.0")
# CORS setup for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(system_router, prefix="/api/v1", tags=["system"])
app.include_router(model_router, prefix="/api/v1", tags=["model"])


@app.get("/")
async def root():
    return {"message": "Welcome to DDoS Detection API"}
