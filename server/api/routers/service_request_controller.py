from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.service_request.service_request_create_dto import ServiceRequestCreateDTO
from application.DTOs.service_request.service_request_response_dto import ServiceRequestResponseDTO
from application.security.jwt_helper import get_current_user
from application.security.rate_limiter import limiter
from application.services.interface.i_service_request_service import IServiceRequestService
from application.services.service_request_service import get_service_request_service

from infrastructure.database import get_db
from infrastructure.entities.enums.enums import UserRole
from infrastructure.entities.user import User


router = APIRouter(prefix="/api/service_request", tags=["Service_request"])

# ================= POST =================
@router.post("/send_service_request", response_model=ServiceRequestResponseDTO, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/day")
async def send_service_request(
        request: Request,
        dto: ServiceRequestCreateDTO,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_user),
        service: IServiceRequestService = Depends(get_service_request_service)
):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only patients can create requests")

    request = await service.create_service_request_app(current_user.id, dto, db)
    if not request or request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")
    return request

# ================= GET =================
@router.get("/pending", response_model=List[ServiceRequestResponseDTO], status_code=status.HTTP_200_OK)
async def get_pending_requests(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_user),
        service: IServiceRequestService = Depends(get_service_request_service)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can view pending requests")

    pending_requests = await service.get_pending_requests_app(db)
    return pending_requests