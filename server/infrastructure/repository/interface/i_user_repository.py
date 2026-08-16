from typing import Protocol
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from infrastructure.entities.user import User


class IUserRepository(Protocol):
    async def create_user_async(self, db: AsyncSession, new_user: User):
        ...
    async def get_user_by_email_async(self, db: AsyncSession, email: str):
        ...
    async def get_user_by_id_async(self, db: AsyncSession, user_id: str):
        ...
    async def update_user_profile_async(self, user_id: str, f_name: str, l_name: str, phone_number: str, address: str, db: AsyncSession):
        ...