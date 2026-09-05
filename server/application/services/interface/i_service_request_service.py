from typing import Protocol, List

from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.service_request.service_request_create_dto import ServiceRequestCreateDTO
from application.DTOs.service_request.service_request_response_dto import ServiceRequestResponseDTO


class IServiceRequestService(Protocol):
    async def create_service_request_app(self, user_id: str, dto: ServiceRequestCreateDTO, db: AsyncSession) -> ServiceRequestResponseDTO | None:
        ...
    async def get_pending_requests_app(self, db: AsyncSession) -> List[ServiceRequestResponseDTO]:
        ...