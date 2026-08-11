import uuid
import enum
from sqlalchemy import Column, String, Enum
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base
from sqlalchemy.orm import relationship

class UserRole(str, enum.Enum):
    ADMIN = 'Admin'
    MED_STAFF = 'MedicalStaff'
    PATIENT = 'Patient'

class User(Base):
    __tablename__ = 'users'
    # Equivalent to the [Key] and Guid from C#
    id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4, index = True)
    first_name = Column(String(50), nullable = False)
    last_name = Column(String(50), nullable = False)

    email = Column(String(100), unique = True, index = True, nullable = False)
    hashed_password = Column(String(100), nullable = False)
    phone_number = Column(String(20), nullable = False)
    address = Column(String(100), nullable = False)

    role = Column(Enum(UserRole), default = UserRole.PATIENT, nullable = False)

    # this line of code tells python how to move trough the tables, from one to another in the db
    # uselist tells the database that this is a 1 on 1 relationship
    # cascade = "all, delete-orphan" protects the db from "trash". There are no "orphans" in the db if something gets deleted
    patient_profile = relationship("PatientProfile", back_populates = "user", uselist = False, cascade = "all, delete-orphan")
    staff_profile = relationship("StaffProfile", back_populates = "user", uselist = False, cascade = "all, delete-orphan")