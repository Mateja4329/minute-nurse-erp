import jwt
import os

from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.entities.user import User
from infrastructure.database import get_db
from infrastructure.repository.interface.i_user_repository import IUserRepository
from infrastructure.repository.user_repository import get_user_repository



SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS512"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(user: User) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Now we pack up the data
    # 'sub' (Subject) is an official JWT standard key for user ID
    # 'exp' (Expiration) official key for token expiration (never would've guessed)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role.value,
        "exp": expire,
    }

    # Now we generate the token STRING
    encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/Login")

async def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: AsyncSession = Depends(get_db),
        repo: IUserRepository = Depends(get_user_repository)
):
    # 1. First we need to try to decode the token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("email")

        if user_email is None:
            raise HTTPException(status_code=401, detail="Invalid token structure")

    # If the token expired or someone changed it, throws an error
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token is invalid or expired",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # 2. Now we check if the token user still exists in the db
    user = await repo.get_user_by_email_async(db, user_email)
    if user is None:
        raise HTTPException(status_code=401, detail="User no longer exists")

    return user