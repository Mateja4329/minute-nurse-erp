from typing import List

from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.profiles.patient_profile_create_dto import PatientProfileCreateDTO
from application.DTOs.profiles.patient_profile_response_dto import PatientProfileResponseDTO
from application.DTOs.profiles.staff_profile_create_dto import StaffProfileCreateDTO
from application.DTOs.profiles.staff_profile_response_dto import StaffProfileResponseDTO
from application.security.jwt_helper import get_current_user
from application.services.interface.i_profile_service import IProfileService
from application.services.profile_service import get_profile_service

from infrastructure.database import get_db
from infrastructure.entities.enums.enums import UserRole
from infrastructure.entities.user import User


router = APIRouter(prefix="/api/profile", tags=["Profile"])

# ================= POST =================
# ----------------- PATIENT -----------------
@router.post("/patient_profile", response_model=PatientProfileResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_patient_profile(
        dto: PatientProfileCreateDTO,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
        service: IProfileService = Depends(get_profile_service)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can create patient profile")

    profile = await service.create_patient_profile_app(dto, db)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")

    return profile

# ----------------- STAFF -----------------
@router.post("/staff_profile", response_model=StaffProfileResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_staff_profile(
        dto: StaffProfileCreateDTO,
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
        service: IProfileService = Depends(get_profile_service)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can create staff_profile")

    profile = await service.create_staff_profile_app(dto, db)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff profile not found")

    return profile

# ================= GET =================
# ----------------- PATIENT -----------------
@router.get("/patient_profiles", response_model=List[PatientProfileResponseDTO], status_code=status.HTTP_200_OK)
async def get_patient_profiles(
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
        service: IProfileService = Depends(get_profile_service)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can view patient profiles")

    return await service.get_patient_profiles_app(db)

# ----------------- STAFF -----------------
@router.get("/staff_profiles", response_model=List[StaffProfileResponseDTO], status_code=status.HTTP_200_OK)
async def get_staff_profiles(
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
        service: IProfileService = Depends(get_profile_service)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can view patient profiles")

    return await service.get_staff_profiles_app(db)