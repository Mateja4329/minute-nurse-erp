from pydantic import BaseModel, Field


class UserUpdateDTO(BaseModel):
    first_name: str | None = Field(default=None, min_length=2, max_length=50)
    last_name: str | None = Field(default=None, min_length=2, max_length=50)
    phone_number: str | None = Field(default=None, max_length=20)
    address: str | None = Field(default=None, max_length=100)