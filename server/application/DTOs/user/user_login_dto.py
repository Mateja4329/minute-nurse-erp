from infrastructure.entities.user import UserRole
from pydantic import BaseModel, EmailStr, Field


class UserLoginDTO(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)