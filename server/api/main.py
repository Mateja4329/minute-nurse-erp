from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from application.security.rate_limiter import limiter

from infrastructure.database import engine, Base

from infrastructure.entities.user import User
from infrastructure.entities.profiles.patient_profile import PatientProfile
from infrastructure.entities.profiles.staff_profile import StaffProfile

from api.routers.user_controller import router as user_controller
from api.routers.email_controller import router as email_controller



@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
app = FastAPI(title="MinuteNurse API", lifespan=lifespan)


app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.add_middleware(
    CORSMiddleware,
    # our frontend uses CRA (create react app), and not Vita. Maybe will change in the future
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"], # allows all api methods, like GET, POST, UPDATE, DELETE...
    allow_headers=["*"] # Allows all headers (even tokens)
)

app.include_router(user_controller)
app.include_router(email_controller)

@app.get("/")
def read_root():
    return {"message": "MinuteNurse API i PostgreSQL baza su uspešno povezani!"}