import enum


class UserRole(str, enum.Enum):
    ADMIN = 'Admin'
    MED_STAFF = 'MedicalStaff'
    PATIENT = 'Patient'

class Schedule(str, enum.Enum):
    SCHEDULED = "Zakazano"
    WAITING = "Čekanje"
    CANCELED = "Otkazano"

class ServiceType(str, enum.Enum):
    DRESSING = "Previjanje"
    SOCIALIZING = "Druženje"
    INFUSION = "Infuzija"
    INJECTION = "Inekcija"
    NUTRITION = "Ishrana"

class LocationPreference(str, enum.Enum):
    CURRENT_ADDRESS = "Trenutna adresa"
    BW_CLINIC = "BW Ambulanta"