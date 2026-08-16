from pydantic import BaseModel, Field, EmailStr

class ContactFormDTO(BaseModel):
    email: EmailStr
    message: str = Field(..., description="Your message", min_length=20, max_length=300)