from pydantic import BaseModel, Field
from uuid import UUID

class StaffProfileCreateDTO(BaseModel):
    user_id: UUID = Field(..., description="ID korisnika iz tabele users")
    job_title: str = Field(..., max_length=50)
    shift: str = Field(..., max_length=20)
    salary: str | None = Field(default=None, max_length=50)
    license_number: str | None = Field(default=None, max_length=50)