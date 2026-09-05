from pydantic import BaseModel, EmailStr
from infrastructure.entities.enums.enums import UserRole
from uuid import UUID

class UserResponseDTO(BaseModel):
    id: UUID

    first_name: str
    last_name: str

    email: EmailStr
    phone_number: str
    address: str

    role: UserRole