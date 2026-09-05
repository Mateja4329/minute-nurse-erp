from datetime import date, time
from uuid import UUID
from pydantic import BaseModel

from infrastructure.entities.enums.enums import Schedule, ServiceType, LocationPreference


class AppointmentResponseDTO(BaseModel):
    id: UUID

    request_id: UUID
    staff_id: UUID
    service_type: ServiceType
    scheduled_date: date
    scheduled_time: time
    location_preference: LocationPreference
    schedule: Schedule
