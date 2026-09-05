from typing import Protocol, List
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.appointment.appointment_create_dto import AppointmentCreateDTO
from application.DTOs.appointment.appointment_response_dto import AppointmentResponseDTO
from infrastructure.entities.user import User


class IAppointmentService(Protocol):
    async def create_appointment_app(self, dto: AppointmentCreateDTO, db: AsyncSession) -> AppointmentResponseDTO | None:
        ...
    async def get_my_appointments_app(self, current_user: User, db: AsyncSession) -> List[AppointmentResponseDTO]:
        ...
    async def get_all_appointments_app(self, db: AsyncSession) -> List[AppointmentResponseDTO]:
        ...