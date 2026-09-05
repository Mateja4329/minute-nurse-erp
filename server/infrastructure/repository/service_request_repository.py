from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.entities.enums.enums import LocationPreference, Schedule
from infrastructure.entities.profiles.patient_profile import PatientProfile
from infrastructure.entities.scheduling.service_request import ServiceRequest
from infrastructure.repository.interface.i_service_request_repository import IServiceRequestRepository


class ServiceRequestRepository(IServiceRequestRepository):
    async def find_patient_profile(self, user_id: str, db: AsyncSession):
        stmt = select(PatientProfile).where(PatientProfile.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalars().one_or_none()

    async def create_service_request_async(
            self,
            request: ServiceRequest,
            db: AsyncSession):
        db.add(request)
        await db.commit()
        await db.refresh(request)

    async def get_pending_requests_async(self, db: AsyncSession) -> Sequence[ServiceRequest]:
        stmt = select(ServiceRequest).where(ServiceRequest.schedule == Schedule.WAITING)
        result = await db.execute(stmt)
        return result.scalars().all()


async def get_service_request_repository() -> IServiceRequestRepository:
    return ServiceRequestRepository()