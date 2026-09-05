from datetime import date, time
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from infrastructure.entities.enums.enums import ServiceType, LocationPreference, Schedule


class AppointmentCreateDTO(BaseModel):
    request_id: UUID = Field(..., description="ID originalnog zahteva pacijenta")
    staff_id: UUID = Field(..., description="ID dodeljenog medicinskog radnika")
    service_type: ServiceType = Field(..., description="Izabrana vrsta usluge")
    schedule_date: date
    schedule_time: time
    location_preference: LocationPreference = Field(..., description="Izabrana lokacija")

    @field_validator('schedule_date')
    @classmethod
    def date_must_be_in_future(cls, v: date) -> date:
        if v <= date.today():
            raise ValueError("Scheduled date must be in the future")
        return v