from typing import Protocol, Sequence
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.entities.scheduling.service_request import ServiceRequest


class IServiceRequestRepository(Protocol):
    async def find_patient_profile(self, user_id: str, db: AsyncSession):
        ...
    async def create_service_request_async(self, request: ServiceRequest, db: AsyncSession):
        ...
    async def get_service_request_async(self, service_request_id: str, db: AsyncSession):
        ...
    async def get_pending_requests_async(self, db: AsyncSession) -> Sequence[ServiceRequest]:
        ...