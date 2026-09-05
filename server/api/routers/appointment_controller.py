from http import HTTPStatus
from typing import List

from fastapi import APIRouter, status, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.appointment.appointment_create_dto import AppointmentCreateDTO
from application.DTOs.appointment.appointment_response_dto import AppointmentResponseDTO
from application.security.jwt_helper import get_current_user
from application.security.rate_limiter import limiter
from application.services.appointment_service import get_appointment_service
from application.services.interface.i_appointment_service import IAppointmentService

from infrastructure.database import get_db
from infrastructure.entities.enums.enums import UserRole
from infrastructure.entities.user import User


router = APIRouter(prefix="/api/appointment", tags=["Appointment"])

@router.post("/create_appointment", response_model=AppointmentResponseDTO, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def create_appointment(
        request: Request, # remember, this is for the rate limiter
        dto: AppointmentCreateDTO,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
        service: IAppointmentService = Depends(get_appointment_service)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privilege")

    appointment = await service.create_appointment_app(dto, db)
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service request or patient profile not found")

    return appointment

@router.get("/all", response_model=List[AppointmentResponseDTO], status_code=status.HTTP_200_OK)
async def get_all_appointments(
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
        service: IAppointmentService = Depends(get_appointment_service)
):
    if current_user.role != UserRole.ADMIN: raise HTTPException(status_code=status.HTTPStatus_403_FORBIDDEN, detail="Admin privilege")
    return await service.get_all_appointments_app(db)

@router.get("/my_calendar", response_model=List[AppointmentResponseDTO], status_code=status.HTTP_200_OK)
async def get_my_calendar(
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
        service: IAppointmentService = Depends(get_appointment_service)
):
    if current_user.role == UserRole.ADMIN:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Use the global admin route")

    appointments = await service.get_my_appointments_app(current_user, db)
    return appointments