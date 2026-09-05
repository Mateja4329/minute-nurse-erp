from uuid import UUID
from pydantic import BaseModel


class StaffProfileResponseDTO(BaseModel):
    id: UUID
    user_id: UUID
    job_title: str
    shift: str
    salary: str | None
    license_number: str | None
    is_active: bool