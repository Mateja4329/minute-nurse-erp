from typing import Protocol

from application.DTOs.email.contact_form_dto import ContactFormDTO


class IEmailService(Protocol):
    async def send_email(self, dto: ContactFormDTO):
        ...