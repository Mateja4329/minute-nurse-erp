from typing import List

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.appointment.appointment_create_dto import AppointmentCreateDTO
from application.DTOs.appointment.appointment_response_dto import AppointmentResponseDTO
from application.mappings.mapper import to_appointment_entity, to_appointment_response_dto, \
    to_appointment_response_dto_list
from application.services.interface.i_appointment_service import IAppointmentService
from infrastructure.entities.enums.enums import Schedule, UserRole, LocationPreference
from infrastructure.entities.user import User

from infrastructure.repository.appointment_repository import get_appointment_repository
from infrastructure.repository.interface.i_appointment_repository import IAppointmentRepository


class AppointmentService(IAppointmentService):
    def __init__(self, repo: IAppointmentRepository):
        self.__repo = repo

    async def create_appointment_app(self, dto: AppointmentCreateDTO, db: AsyncSession) -> AppointmentResponseDTO | None:
        get_service_request = await self.__repo.find_service_request(dto.request_id, db)
        if get_service_request is None or get_service_request.schedule != Schedule.WAITING:
            return None

        get_staff_profile = await self.__repo.find_staff_profile_by_id(dto.staff_id, db)
        if get_staff_profile is None:
            return None

        appointment = to_appointment_entity(dto)
        appointment.request_id = get_service_request.id
        appointment.staff_id = get_staff_profile.id

        get_service_request.schedule = Schedule.SCHEDULED

        await self.__repo.create_appointment_async(appointment, db)
        return to_appointment_response_dto(appointment)

    async def get_my_appointments_app(self, current_user: User, db: AsyncSession) -> List[AppointmentResponseDTO]:
        if current_user.role == UserRole.PATIENT:
            patient_profile = await self.__repo.find_patient_profile_async(current_user.id, db)
            if not patient_profile:
                return []
            appointments = await self.__repo.get_appointments_by_patient_async(patient_profile.id, db)
            return to_appointment_response_dto_list(appointments)

        elif current_user.role == UserRole.MED_STAFF:
            staff_profile = await self.__repo.find_staff_profile_by_user_id(current_user.id, db)
            if not staff_profile:
                return []
            appointments = await self.__repo.get_appointments_by_staff_async(staff_profile.id, db)
            return to_appointment_response_dto_list(appointments)

        return []

    async def get_all_appointments_app(self, db: AsyncSession) -> List[AppointmentResponseDTO]:
        appointments = await self.__repo.get_all_appointments_async(db)
        return to_appointment_response_dto_list(appointments)


async def get_appointment_service(repo: IAppointmentRepository = Depends(get_appointment_repository)) -> IAppointmentService:
    return AppointmentService(repo=repo)