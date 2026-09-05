from pydantic import BaseModel, Field
from datetime import date
from uuid import UUID

class PatientProfileCreateDTO(BaseModel):
    user_id: UUID = Field(..., description="ID korisnika iz tabele users")
    family_name: str = Field(..., min_length=2, max_length=100)
    date_of_birth: date
    contact_email: str | None = Field(default=None, max_length=100)
    care_notes: str | None = Field(default=None)