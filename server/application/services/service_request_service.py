from typing import List

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.service_request.service_request_create_dto import ServiceRequestCreateDTO
from application.DTOs.service_request.service_request_response_dto import ServiceRequestResponseDTO
from application.mappings.mapper import to_service_request_entity, to_service_request_response_dto, \
    to_service_request_response_dto_list
from application.services.interface.i_service_request_service import IServiceRequestService

from infrastructure.repository.interface.i_service_request_repository import IServiceRequestRepository
from infrastructure.repository.service_request_repository import get_service_request_repository


class ServiceRequestService(IServiceRequestService):
    def __init__(self, repo: IServiceRequestRepository):
        self.__repo = repo

    async def create_service_request_app(self, user_id: str, dto: ServiceRequestCreateDTO,
                                     db: AsyncSession) -> ServiceRequestResponseDTO | None:
        patient_profile = await self.__repo.find_patient_profile(user_id, db)
        if patient_profile is None:
            return None

        request = to_service_request_entity(dto)
        request.patient_id = patient_profile.id

        await self.__repo.create_service_request_async(request, db)
        return to_service_request_response_dto(request)

    async def get_pending_requests_app(self, db: AsyncSession) -> List[ServiceRequestResponseDTO]:
        requests = await self.__repo.get_pending_requests_async(db)
        return to_service_request_response_dto_list(requests)


async def get_service_request_service(repo: IServiceRequestRepository = Depends(get_service_request_repository)) -> IServiceRequestService:
    return ServiceRequestService(repo=repo)