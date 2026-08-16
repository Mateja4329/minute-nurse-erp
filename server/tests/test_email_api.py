from httpx import AsyncClient, ASGITransport
from api.main import app

from application.services.email_service import get_email_service
from application.DTOs.email.contact_form_dto import ContactFormDTO


class MockEmailService:
    async def send_email(self, dto: ContactFormDTO):
        pass

async def override_get_email_service():
    return MockEmailService()


async def test_inquiry_email_short_message_returns_422():
    # Arrange
    payload = {
        "email": "test@example.com",
        "message": "Test" # Less than 20 characters
    }

    # Act
    # ASGITransport allows us to test routes without actually running the server (uvicorn)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/email/inquiry", json=payload)

    # Assert
    assert response.status_code == 422

    # check if fastapi returned the array with error details
    response_data = response.json()
    assert "detail" in response_data
    assert type(response_data["detail"]) == list

async def test_inquiry_email_rate_limiter_returns_429():
    # Arrange
    payload = {
        "email": "test@example.com",
        "message": "This is a valid message which has over 20 characters."
    }

    # Act
    # We will send 3 quick requests fro  the same IP address
    # ASGITransport recieves "client" parameter so the limiter can know which is the IP address
    transport = ASGITransport(app=app, client=("127.0.0.1", 12345))
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp1 = await ac.post("/api/email/inquiry", json=payload)
        resp2 = await ac.post("/api/email/inquiry", json=payload)
        resp3 = await ac.post("/api/email/inquiry", json=payload)

    # Assert
    assert resp1.status_code == 200
    assert resp2.status_code == 200
    assert resp3.status_code == 429 # Too many requests

    # Now we clean up, so we don't break other tests
    app.dependency_overrides.clear()