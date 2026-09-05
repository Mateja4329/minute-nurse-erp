from uuid import UUID
from datetime import date, time
from pydantic import BaseModel

from infrastructure.entities.enums.enums import Schedule, ServiceType, LocationPreference


class ServiceRequestResponseDTO(BaseModel):
    id: UUID

    service_type: ServiceType
    location_preference: LocationPreference
    preferred_date: date
    preferred_time: time
    schedule: Schedule