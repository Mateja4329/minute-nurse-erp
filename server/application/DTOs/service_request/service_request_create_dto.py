from datetime import date, time
from pydantic import BaseModel, Field, field_validator

from infrastructure.entities.enums.enums import ServiceType, LocationPreference


class ServiceRequestCreateDTO(BaseModel):
    service_type: ServiceType = Field(..., description="Izabrana vrsta usluge")
    location_preference: LocationPreference = Field(..., description="Izabrana lokacija")
    preferred_date: date
    preferred_time: time

    @field_validator('preferred_date')
    @classmethod
    def date_must_be_in_future(cls, v: date) -> date:
        if v <= date.today():
            raise ValueError("Preferred date must be in the future")
        return v

# ------------------------------------------------------------------------------
# cls is not a command, but a conventional parameter name representing the class
# itself inside model validators or class methods.

# It stands for "class" and points to the specific
# Pydantic BaseModel class where the validator is defined.

# Decorator @classmethod
# In the Pydantic V2 architecture, validation of isolated fields occurs before
# the Python object (instance) is even fully created in memory.
# That's why the function cannot use self (which represents a finished object),
# but must be bound to the class itself via the @classmethod
# decorator and the cls parameter.

# Data access: @field_validator is completely blind to the rest of the form.
# When validating the date, it has no access to the service type or location.
# See only the value of v (that one date).

# Comparison logic (confirm_password): When registering,
# you need to compare two different fields (password and confirm_password).
# This is technically impossible to do with the field validator because
# it cannot read two attributes at the same time.

# Execution moment (mode='after'): The decorator @model_validator(mode='after')
# is activated only at the very end. It waits for all @field_validators
# to finish their work and for the Python object to be fully formed.
# That's why in that function you have access to the entire object (via self or the instantiated model)
# and you can smoothly do if self.password != self.confirm_password.
# ------------------------------------------------------------------------------