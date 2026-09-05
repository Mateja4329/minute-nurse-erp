from uuid import UUID

from sqlalchemy import select, Sequence
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.entities.profiles.patient_profile import PatientProfile
from infrastructure.entities.profiles.staff_profile import StaffProfile
from infrastructure.entities.scheduling.appointment import Appointment
from infrastructure.entities.scheduling.service_request import ServiceRequest
from infrastructure.repository.interface.i_appointment_repository import IAppointmentRepository


class AppointmentRepository(IAppointmentRepository):
    async def find_staff_profile_by_id(self, staff_id: UUID, db: AsyncSession):
        stmt = select(StaffProfile).where(StaffProfile.id == staff_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    async def find_staff_profile_by_user_id(self, user_id: UUID, db: AsyncSession):
        stmt = select(StaffProfile).where(StaffProfile.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    async def find_service_request(self, service_request_id: UUID, db: AsyncSession):
        stmt = select(ServiceRequest).where(ServiceRequest.id == service_request_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    async def find_staff_profile(self, staff_id: UUID, db: AsyncSession):
        stmt = select(StaffProfile).where(StaffProfile.id == staff_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    async def find_patient_profile_async(self, user_id: UUID, db: AsyncSession):
        stmt = select(PatientProfile).where(PatientProfile.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    async def create_appointment_async(self, request: Appointment, db: AsyncSession):
        db.add(request)
        await db.commit()
        await db.refresh(request)

    async def get_appointments_by_patient_async(self, patient_id: UUID, db: AsyncSession):
        stmt = (
            select(Appointment)
            .join(ServiceRequest, Appointment.request_id == ServiceRequest.id)
            .where(ServiceRequest.patient_id == patient_id)
        )
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_appointments_by_staff_async(self, staff_id: UUID, db: AsyncSession):
        stmt = select(Appointment).where(Appointment.staff_id == staff_id)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_all_appointments_async(self, db: AsyncSession) -> Sequence[Appointment]:
        stmt = select(Appointment)
        result = await db.execute(stmt)
        return result.scalars().all()


async def get_appointment_repository() -> IAppointmentRepository:
    return AppointmentRepository()