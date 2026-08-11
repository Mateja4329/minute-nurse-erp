import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

# first we load variables from .env file
load_dotenv()
# then we read the url from the base
SQLAlCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLAlCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL not found. Check if .env file exists")

# This is the bridge to the base (basically enabling connection)
engine = create_async_engine(SQLAlCHEMY_DATABASE_URL)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)
Base = declarative_base()

async def get_db():
    db = AsyncSessionLocal() # opens the connection to the db
    try:
        yield db # pauses the function and gives connection to the controller to finish the job
    finally:
        await db.close() # if it passed or not, the session must always be safely closed

# or just use this more "elegant" way of typing:
'''
async def get_db():
    async with AsyncSessionLocal() as db:
        yield db
'''
# they do the same job. It's the same as "using()" in C#


# http://127.0.0.1:8000
# http://127.0.0.1:8000/docs
# Command: fastapi dev
