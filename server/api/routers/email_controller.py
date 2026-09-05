import smtplib

from fastapi import APIRouter, Depends, HTTPException, Request

from application.DTOs.email.contact_form_dto import ContactFormDTO

from application.services.interface.i_email_service import IEmailService
from application.services.email_service import get_email_service

from application.security.rate_limiter import limiter

router = APIRouter(prefix="/api/email", tags=["Email"])

# ================= POST =================
@router.post("/inquiry")
@limiter.limit("2/minute") # Max 2 requests in a minute
async def inquiry_email(
        request: Request,
        dto: ContactFormDTO,
        service: IEmailService = Depends(get_email_service)
):
    try:
        if len(set(dto.message)) < 3:
            raise HTTPException(
                status_code=400,
                detail="The message makes no sense. Please write a clear query.")

        forbidden_words = ["spam", "reklama", "kupi"]
        if any(word in dto.message for word in forbidden_words):
            raise HTTPException(
                status_code=400,
                detail="Your message contains illegal words."
            )

        await service.send_email(dto)
        return {"message": "The inquiry has been successfully sent!"}

    except HTTPException as http_exc:
        # Catch our manual errors and send it to the frontend
        raise http_exc

    except smtplib.SMTPException as smtp_exc:
        # Catch specific errors for sending email (like Google problems)
        print(f"SMPT Error: {smtp_exc}")
        raise HTTPException(
            status_code=503,
            detail="We are currently experiencing a problem with our email server. Try a little later.")

    except Exception as e:
        # General server error
        print(f"Unknown Error sending email: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected internal error has occurred. Our team is working to resolve the issue."
        )

