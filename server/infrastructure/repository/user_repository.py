from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from application.DTOs.user.user_update_dto import UserUpdateDTO
from infrastructure.entities.user import User
from infrastructure.repository.interface.i_user_repository import IUserRepository


class UserRepository(IUserRepository):
    # ================= POST =================
    # --------------- REGISTER ---------------
    async def create_user_async(self, db: AsyncSession, new_user: User):
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    # --------------- LOGIN ---------------
    # --------------- EMAIL ---------------
    async def get_user_by_email_async(self, db: AsyncSession, email: str):
        # Creating an SQL request like SELECT * FROM users WHERE email = '...'
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()
        # scalar_one_or_none() return an object if it finds it, or None if it doesn't

    # ================= GET =================
    # --------------- ID ---------------
    async def get_user_by_id_async(self, db: AsyncSession, user_id: str):
        stmt = select(User).where(User.id == user_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    # ================= PUT =================
    async def update_user_profile_async(
            self,
            user_id: str,
            f_name: str, l_name: str,
            phone_number: str, address: str,
            db: AsyncSession):

        user = await self.get_user_by_id_async(db, user_id)
        if user is None:
            return None

        if f_name is not None:
            user.first_name = f_name
        if l_name is not None:
            user.last_name = l_name
        if phone_number is not None:
            user.phone_number = phone_number
        if address is not None:
            user.address = address

        await db.commit()
        await db.refresh(user)
        return user

# This makes an instance for repo and returns it to service
async def get_user_repository() -> IUserRepository:
    return UserRepository()