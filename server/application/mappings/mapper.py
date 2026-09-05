from typing import Sequence

from application.DTOs.appointment.appointment_create_dto import AppointmentCreateDTO
from application.DTOs.appointment.appointment_response_dto import AppointmentResponseDTO
from application.DTOs.profiles.patient_profile_create_dto import PatientProfileCreateDTO
from application.DTOs.profiles.patient_profile_response_dto import PatientProfileResponseDTO
from application.DTOs.profiles.staff_profile_create_dto import StaffProfileCreateDTO
from application.DTOs.profiles.staff_profile_response_dto import StaffProfileResponseDTO
from application.DTOs.user.user_create_dto import UserCreateDTO
from application.DTOs.user.user_response_dto import UserResponseDTO
from application.DTOs.service_request.service_request_create_dto import ServiceRequestCreateDTO
from application.DTOs.service_request.service_request_response_dto import ServiceRequestResponseDTO

from infrastructure.entities.enums.enums import UserRole
from infrastructure.entities.profiles.patient_profile import PatientProfile
from infrastructure.entities.profiles.staff_profile import StaffProfile
from infrastructure.entities.scheduling.appointment import Appointment
from infrastructure.entities.scheduling.service_request import ServiceRequest
from infrastructure.entities.user import User

from typing import List


# ========================== USER ==========================
def to_user_entity(dto: UserCreateDTO, hashed_password: str) -> User:
    return User(
        first_name=dto.first_name,
        last_name=dto.last_name,
        email=dto.email,
        hashed_password=hashed_password,
        phone_number=dto.phone_number,
        address=dto.address,
        role=UserRole.PATIENT
    )

def to_user_response_dto(user: User) -> UserResponseDTO:
    return UserResponseDTO(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone_number=user.phone_number,
        address=user.address,
        role=user.role
    )

def to_user_response_dto_list(users: List[User]) -> List[UserResponseDTO]:
    return [to_user_response_dto(user) for user in users]

# ========================== SERVICE REQUEST ==========================
def to_service_request_entity(dto: ServiceRequestCreateDTO) -> ServiceRequest:
    return ServiceRequest(
        service_type=dto.service_type,
        location_preference=dto.location_preference,
        preferred_date=dto.preferred_date,
        preferred_time=dto.preferred_time,
    )

def to_service_request_response_dto(service: ServiceRequest) -> ServiceRequestResponseDTO:
    return ServiceRequestResponseDTO(
        id=service.id,
        service_type=service.service_type,
        location_preference=service.location_preference,
        preferred_date=service.preferred_date,
        preferred_time=service.preferred_time,
        schedule=service.schedule
    )

def to_service_request_response_dto_list(service_requests: Sequence[ServiceRequest]) -> List[ServiceRequestResponseDTO]:
    return [to_service_request_response_dto(service) for service in service_requests]

# ========================== APPOINTMENT ==========================
def to_appointment_entity(dto: AppointmentCreateDTO) -> Appointment:
    return Appointment(
        request_id=dto.request_id,
        staff_id=dto.staff_id,
        service_type=dto.service_type,
        scheduled_date=dto.schedule_date,
        scheduled_time=dto.schedule_time,
        location_preference=dto.location_preference
    )

def to_appointment_response_dto(appointment: Appointment) -> AppointmentResponseDTO:
    return AppointmentResponseDTO(
        id=appointment.id,
        request_id=appointment.request_id,
        staff_id=appointment.staff_id,
        service_type=appointment.service_type,
        scheduled_date=appointment.scheduled_date,
        scheduled_time=appointment.scheduled_time,
        location_preference=appointment.location_preference,
        schedule=appointment.schedule
    )

def to_appointment_response_dto_list(appointments: Sequence[Appointment]) -> List[AppointmentResponseDTO]:
    return [to_appointment_response_dto(appointment) for appointment in appointments]

# ========================== PROFILES ==========================
# -------------------------- PATIENT ---------------------------
def to_patient_profile_entity(dto: PatientProfileCreateDTO) -> PatientProfile:
    return PatientProfile(
        user_id=dto.user_id,
        family_name=dto.family_name,
        date_of_birth=dto.date_of_birth,
        contact_email=dto.contact_email or "",
        care_notes=dto.care_notes or ""
    )

def to_patient_profile_response_dto(profile: PatientProfile) -> PatientProfileResponseDTO:
    return PatientProfileResponseDTO(
        id=profile.id,
        user_id=profile.user_id,
        family_name=profile.family_name,
        date_of_birth=profile.date_of_birth,
        contact_email=profile.contact_email,
        care_notes=profile.care_notes,
        is_active=profile.is_active
    )

def to_patient_profile_response_dto_list(profiles: Sequence[PatientProfile]) -> List[PatientProfileResponseDTO]:
    return [to_patient_profile_response_dto(profile) for profile in profiles]

# -------------------------- STAFF ---------------------------
def to_staff_profile_entity(dto: StaffProfileCreateDTO) -> StaffProfile:
    return StaffProfile(
        user_id=dto.user_id,
        job_title=dto.job_title,
        shift=dto.shift,
        salary=dto.salary or "",
        license_number=dto.license_number or ""
    )

def to_staff_profile_response_dto(profile: StaffProfile) -> StaffProfileResponseDTO:
    return StaffProfileResponseDTO(
        id=profile.id,
        user_id=profile.user_id,
        job_title=profile.job_title,
        shift=profile.shift,
        salary=profile.salary,
        license_number=profile.license_number,
        is_active=profile.is_active
    )

def to_staff_profile_response_dto_list(profiles: Sequence[StaffProfile]) -> List[StaffProfileResponseDTO]:
    return [to_staff_profile_response_dto(profile) for profile in profiles]