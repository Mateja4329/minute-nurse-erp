from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from infrastructure.database import engine, Base

from infrastructure.entities.profiles.patient_profile import PatientProfile
from infrastructure.entities.profiles.staff_profile import StaffProfile
from infrastructure.entities.user import User

from api.routers.user_controller import router as user_controller



@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
app = FastAPI(title="MinuteNurse API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    # our frontend uses CRA (create react app), and not Vita. Maybe will change in the future
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"], # allows all api methods, like GET, POST, UPDATE, DELETE...
    allow_headers=["*"] # Allows all headers (even tokens)
)

app.include_router(user_controller)

@app.get("/")
def read_root():
    return {"message": "MinuteNurse API i PostgreSQL baza su uspešno povezani!"}