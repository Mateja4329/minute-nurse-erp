from typing import Protocol, List
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.profiles.patient_profile_create_dto import PatientProfileCreateDTO
from application.DTOs.profiles.patient_profile_response_dto import PatientProfileResponseDTO
from application.DTOs.profiles.staff_profile_create_dto import StaffProfileCreateDTO
from application.DTOs.profiles.staff_profile_response_dto import StaffProfileResponseDTO


class IProfileService(Protocol):
    async def create_patient_profile_app(self, dto: PatientProfileCreateDTO, db: AsyncSession) -> PatientProfileResponseDTO | None:
        ...
    async def create_staff_profile_app(self, dto: StaffProfileCreateDTO, db: AsyncSession) -> StaffProfileResponseDTO | None:
        ...
    async def get_patient_profiles_app(self, db: AsyncSession) -> List[PatientProfileResponseDTO]:
        ...
    async def get_staff_profiles_app(self, db: AsyncSession) -> List[StaffProfileResponseDTO]:
        ...