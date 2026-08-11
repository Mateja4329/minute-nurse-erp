from pydantic import BaseModel
from application.DTOs.user.user_response_dto import UserResponseDTO

class LoginResponseDTO(BaseModel):
    token: str
    user: UserResponseDTO