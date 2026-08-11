from infrastructure.entities.user import UserRole
from pydantic import BaseModel, EmailStr, Field, model_validator


class UserCreateDTO(BaseModel):
    first_name: str = Field(..., min_length = 2, max_length = 50)
    last_name: str = Field(..., min_length = 2, max_length = 50)

    email: EmailStr
    phone_number: str = Field(..., max_length=20)
    address: str = Field(..., max_length=100)

    role: UserRole = UserRole.PATIENT

    password: str = Field(..., min_length = 6)
    confirm_password: str = Field(..., min_length=6)

    @model_validator(mode='after')
    def check_password_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

    @model_validator(mode='after')
    def check_role(self):
        if self.role == UserRole.ADMIN:
            raise ValueError("Admin role not allowed")
        return self

    ''' ---------- Explanation ----------
    1. Use mode='after' so both fields are already parsed and present in self.
    2. Return self at the end of the validator method if validation passes.
    3. Raise a standard ValueError to fail validation and return an error message.
    '''