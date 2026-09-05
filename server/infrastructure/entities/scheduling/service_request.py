import uuid

from sqlalchemy import UUID, Column, ForeignKey, Date, Time, Enum
from sqlalchemy.orm import relationship

from infrastructure.database import Base
from infrastructure.entities.enums.enums import Schedule, ServiceType, LocationPreference


class ServiceRequest(Base):
    __tablename__ = 'service_request'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey('patients_profile.id'), nullable=False, index=True)
    service_type = Column(Enum(ServiceType), nullable=False)
    location_preference = Column(Enum(LocationPreference), nullable=False)
    preferred_date = Column(Date, nullable=False)
    preferred_time = Column(Time, nullable=False)
    schedule = Column(Enum(Schedule), default=Schedule.WAITING, nullable=False)


    # We don't need to use "uselist=True" for One-To-Many or Many-To-Many relationship because sqlalchemy has it set on default
    patient_profile = relationship("PatientProfile", back_populates="service_request")
    appointment = relationship("Appointment", back_populates="service_request", uselist=False,
                               cascade="all, delete-orphan")
