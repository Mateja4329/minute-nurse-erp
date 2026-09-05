from datetime import date
from uuid import UUID
from pydantic import BaseModel


class PatientProfileResponseDTO(BaseModel):
    id: UUID
    user_id: UUID
    family_name: str
    date_of_birth: date
    contact_email: str | None
    care_notes: str | None
    is_active: bool