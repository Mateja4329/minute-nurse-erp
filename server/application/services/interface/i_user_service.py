from typing import Protocol
from sqlalchemy.ext.asyncio import AsyncSession
from application.DTOs.user.user_create_dto import UserCreateDTO
from application.DTOs.user.user_login_dto import UserLoginDTO
from application.DTOs.user.user_response_dto import UserResponseDTO


class IUserService(Protocol):
    async def register_new_user_app(self, dto: UserCreateDTO, db: AsyncSession) -> UserResponseDTO:
        ...
    async def login_user_app(self, dto: UserLoginDTO, db: AsyncSession) -> tuple[UserResponseDTO, str] | None:
        ...