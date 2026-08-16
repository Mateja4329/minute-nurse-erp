from typing import Protocol
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.user.login_response_dto import LoginResponseDTO
from application.DTOs.user.user_create_dto import UserCreateDTO
from application.DTOs.user.user_login_dto import UserLoginDTO
from application.DTOs.user.user_response_dto import UserResponseDTO
from application.DTOs.user.user_update_dto import UserUpdateDTO


class IUserService(Protocol):
    async def register_new_user_app(self, dto: UserCreateDTO, db: AsyncSession) -> UserResponseDTO:
        ...
    async def login_user_app(self, dto: UserLoginDTO, db: AsyncSession) -> tuple[LoginResponseDTO, str] | None:
        ...
    async def refresh_token_app(self, refresh_token: str, db: AsyncSession) -> tuple[str, str] | None:
        ...
    async def get_user_profile_app(self, user_id: str, db: AsyncSession) -> UserResponseDTO | None:
        ...
    async def update_user_profile_app(self, user_id: str, request: UserUpdateDTO, db: AsyncSession) -> UserResponseDTO | None:
        ...