import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, Integer, String, Date, Text, Boolean, ForeignKey
from infrastructure.database import Base
from sqlalchemy.orm import relationship

# Profiles are used for ADMIN purposes, so we don't complicate with making the user inherit all of these attributes.
# This sort of filters them out

class PatientProfile(Base):
    __tablename__ = "patients_profile"

    id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4, index = True)
    user_id = Column(UUID(as_uuid = True), ForeignKey("users.id"), unique = True, nullable = False)

    family_name = Column(String(100), nullable = False)

    date_of_birth = Column(Date, nullable = False)
    contact_email = Column(String(100), nullable = True) #optional email
    care_notes = Column(Text, nullable = True)

    is_active = Column(Boolean, default = True) #For soft delete

    # this line of code tells SQLAlchemy that this relation and the one from user class have the same relationship
    user = relationship("User", back_populates="patient_profile")