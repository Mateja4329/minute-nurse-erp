import uuid
from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from infrastructure.database import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

class StaffProfile(Base):
    __tablename__ = "staff_profile"

    id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4, index = True)
    user_id = Column(UUID(as_uuid = True), ForeignKey("users.id"), unique = True, nullable = False)

    phone_number = Column(String(20), nullable = False)

    job_title = Column(String(50), nullable = False)
    shift = Column(String(20), nullable = False)
    salary = Column(String(50), nullable = True)

    license_number = Column(String(50), unique = True, nullable = True)
    is_active = Column(Boolean, default = True)

    user = relationship("User", back_populates="staff_profile")
