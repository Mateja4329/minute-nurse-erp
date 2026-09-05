import enum
import uuid

from sqlalchemy import Column, UUID, ForeignKey, Date, Time, Enum
from sqlalchemy.orm import relationship

from infrastructure.database import Base
from infrastructure.entities.enums.enums import Schedule, ServiceType, LocationPreference


class Appointment(Base):
    __tablename__ = "appointment"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    request_id = Column(UUID(as_uuid=True), ForeignKey('service_request.id'), unique=True, nullable=False, index=True)
    staff_id = Column(UUID(as_uuid=True), ForeignKey('staff_profile.id'), nullable=False, index=True)
    service_type = Column(Enum(ServiceType), nullable=False)
    scheduled_date = Column(Date, nullable=False)
    scheduled_time = Column(Time, nullable=False)
    location_preference = Column(Enum(LocationPreference), nullable=False)
    schedule = Column(Enum(Schedule), default=Schedule.SCHEDULED, nullable=False)


    service_request = relationship("ServiceRequest", back_populates="appointment")
    staff_profile = relationship("StaffProfile", back_populates="appointment")