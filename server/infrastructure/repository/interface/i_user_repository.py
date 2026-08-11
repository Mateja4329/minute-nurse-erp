from typing import Protocol
from sqlalchemy.ext.asyncio import AsyncSession
from infrastructure.entities.user import User


class IUserRepository(Protocol):
    async def create_user_async(self, db: AsyncSession, new_user: User):
        ...
    async def get_user_by_email_async(self, db: AsyncSession, email: str):
        ...