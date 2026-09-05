from typing import List

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.profiles.patient_profile_create_dto import PatientProfileCreateDTO
from application.DTOs.profiles.patient_profile_response_dto import PatientProfileResponseDTO
from application.DTOs.profiles.staff_profile_create_dto import StaffProfileCreateDTO
from application.DTOs.profiles.staff_profile_response_dto import StaffProfileResponseDTO
from application.mappings.mapper import to_patient_profile_entity, to_patient_profile_response_dto, \
    to_staff_profile_entity, to_staff_profile_response_dto, to_patient_profile_response_dto_list, \
    to_staff_profile_response_dto_list
from application.services.interface.i_profile_service import IProfileService
from infrastructure.entities.enums.enums import UserRole

from infrastructure.repository.interface.i_profile_repository import IProfileRepository
from infrastructure.repository.profile_repository import get_profile_repository


class ProfileService(IProfileService):
    def __init__(self, repo: IProfileRepository):
        self.__repo = repo

    # ================= POST =================
    async def create_patient_profile_app(self, dto: PatientProfileCreateDTO, db: AsyncSession) -> PatientProfileResponseDTO | None:
        existing_user = await self.__repo.find_user_id_async(dto.user_id, db)
        if existing_user is None or existing_user.role != UserRole.PATIENT:
            return None

        existing_profile = await self.__repo.find_patient_profile_by_user_id_async(dto.user_id, db)
        if existing_profile is not None:
            return None

        profile = to_patient_profile_entity(dto)

        await self.__repo.create_patient_profile_async(profile, db)
        return to_patient_profile_response_dto(profile)

    async def create_staff_profile_app(self, dto: StaffProfileCreateDTO, db: AsyncSession) -> StaffProfileResponseDTO | None:
        existing_user = await self.__repo.find_user_id_async(dto.user_id, db)
        if existing_user is None or existing_user.role == UserRole.ADMIN:
            return None

        # we update the patient user to med staff if he's a patient
        existing_user.role = UserRole.MED_STAFF

        existing_profile = await self.__repo.find_staff_profile_by_user_id_async(dto.user_id, db)
        if existing_profile is not None:
            return None

        profile = to_staff_profile_entity(dto)

        await self.__repo.create_staff_profile_async(profile, db)
        return to_staff_profile_response_dto(profile)

    # ================= GET =================
    async def get_patient_profiles_app(self, db: AsyncSession) -> List[PatientProfileResponseDTO]:
        profiles = await self.__repo.get_patient_profiles_async(db)
        return to_patient_profile_response_dto_list(profiles)

    async def get_staff_profiles_app(self, db: AsyncSession) -> List[StaffProfileResponseDTO]:
        profiles = await self.__repo.get_staff_profiles_async(db)
        return to_staff_profile_response_dto_list(profiles)


async def get_profile_service(repo: IProfileRepository = Depends(get_profile_repository)) -> IProfileService:
    return ProfileService(repo=repo)