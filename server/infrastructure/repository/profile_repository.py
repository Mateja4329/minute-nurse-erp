from sqlalchemy import select, UUID, Sequence
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.profiles.patient_profile_response_dto import PatientProfileResponseDTO
from infrastructure.entities.profiles.patient_profile import PatientProfile
from infrastructure.entities.profiles.staff_profile import StaffProfile
from infrastructure.entities.user import User
from infrastructure.repository.interface.i_profile_repository import IProfileRepository


class ProfileRepository(IProfileRepository):
    async def find_user_id_async(self, profile_id: UUID, db: AsyncSession):
        stmt = select(User).where(User.id == profile_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    async def find_patient_profile_by_user_id_async(self, user_id: UUID, db: AsyncSession):
        stmt = select(PatientProfile).where(PatientProfile.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    async def find_staff_profile_by_user_id_async(self, user_id: UUID, db: AsyncSession):
        stmt = select(StaffProfile).where(StaffProfile.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    async def create_patient_profile_async(self, patient_profile: PatientProfile, db: AsyncSession):
        db.add(patient_profile)
        await db.commit()
        await db.refresh(patient_profile)

    async def create_staff_profile_async(self, staff_profile: StaffProfile, db: AsyncSession):
        db.add(staff_profile)
        await db.commit()
        await db.refresh(staff_profile)

    async def get_patient_profiles_async(self, db: AsyncSession) -> Sequence[PatientProfile]:
        profiles = select(PatientProfile)
        result = await db.execute(profiles)
        return result.scalars().all()

    async def get_staff_profiles_async(self, db: AsyncSession) -> Sequence[StaffProfile]:
        profiles = select(StaffProfile)
        result = await db.execute(profiles)
        return result.scalars().all()

async def get_profile_repository() -> ProfileRepository:
    return ProfileRepository()