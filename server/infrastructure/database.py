from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from websockets import connect

# Here we enter the data from docker-compose.yml
# Format is: postgresql://username:password@host:port/database_name
SQLALCHEMY_DATABASE_URL = ""#connect.env('POSTGRESQL_URI')

# engine enables the physical connection with the database
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# SessionLocal represents one "session" or communication with the db
# Every time when the user sends a request, we open the session, do our thing and close it
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the original class for our future tables to inherit
Base = declarative_base()

# http://127.0.0.1:8000
# http://127.0.0.1:8000/docs
# Command: fastapi dev
