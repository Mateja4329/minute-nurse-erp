import os
from pydantic import SecretStr
from fastapi_mail import ConnectionConfig, MessageSchema, FastMail, MessageType

from application.DTOs.email.contact_form_dto import ContactFormDTO
from application.services.interface.i_email_service import IEmailService



MAIL_USER = os.getenv("MAIL_USERNAME")
MAIL_PASS = os.getenv("MAIL_PASSWORD")
MAIL_SENDER = os.getenv("MAIL_FROM")

if not MAIL_USER or not MAIL_PASS or not MAIL_SENDER:
    raise ValueError("Email konfiguracija (MAIL_USERNAME, PASSWORD, FROM) nedostaje u .env fajlu!")

# Type assertion, we tell linter that these objects are not None (the warning still isn't gone, I hate it)
assert MAIL_USER is not None
assert MAIL_PASS is not None
assert MAIL_SENDER is not None

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USER,
    MAIL_PASSWORD=SecretStr(MAIL_PASS),  # Added this password to SecretStr
    MAIL_FROM=MAIL_SENDER,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)


class EmailService(IEmailService):

    async def send_email(self, dto: ContactFormDTO):
        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #125447;">Novi upit sa MinuteNurse portala</h2>
            <p><strong>Email pošiljaoca (gosta):</strong> <a href="mailto:{dto.email}">{dto.email}</a></p>
            <hr style="border: 1px solid #eee;" />
            <p><strong>Sadržaj poruke:</strong></p>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">{dto.message}</p>
          </body>
        </html>
        """

        message = MessageSchema(
            subject=f"Novi upit od: {dto.email}",
            recipients=[MAIL_USER],  # Sending to our server
            body=html_content,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        return await fm.send_message(message)


async def get_email_service():
    return EmailService()