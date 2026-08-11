from application.DTOs.user.user_create_dto import UserCreateDTO
from application.DTOs.user.user_response_dto import UserResponseDTO
from infrastructure.entities.user import User
from typing import List

def to_user_entity(dto: UserCreateDTO, hashed_password: str) -> User:
    return User(
        first_name=dto.first_name,
        last_name=dto.last_name,
        email=dto.email,
        hashed_password=hashed_password,
        phone_number=dto.phone_number,
        address=dto.address,
        role=dto.role
    )

def to_user_response_dto(user: User) -> UserResponseDTO:
    return UserResponseDTO(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone_number=user.phone_number,
        address=user.address,
        role=user.role
    )

def to_user_response_dto_list(users: List[User]) -> List[UserResponseDTO]:
    return [to_user_response_dto(user) for user in users]