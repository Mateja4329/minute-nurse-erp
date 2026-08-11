from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from infrastructure.entities.user import User
from infrastructure.repository.interface.i_user_repository import IUserRepository


class UserRepository(IUserRepository):
    '''--------------- REGISTER ---------------'''
    async def create_user_async(self, db: AsyncSession, new_user: User):
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    '''--------------- LOGIN ---------------'''
    async def get_user_by_email_async(self, db: AsyncSession, email: str):
        # Creating an SQL request like SELECT * FROM users WHERE email = '...'
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()
        # scalar_one_or_none() return an object if it finds it, or None if it doesn't

# This makes an instance for repo and returns it to service
async def get_user_repository() -> IUserRepository:
    return UserRepository()