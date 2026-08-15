from fastapi import APIRouter, Depends, Response, HTTPException, Cookie
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.user.user_create_dto import UserCreateDTO
from application.DTOs.user.user_login_dto import UserLoginDTO
from application.DTOs.user.login_response_dto import LoginResponseDTO
from application.DTOs.user.user_response_dto import UserResponseDTO
from application.security.jwt_helper import get_current_user

from application.services.interface.i_user_service import IUserService
from application.services.user_service import get_user_service

from infrastructure.database import get_db
from infrastructure.entities.user import User
from infrastructure.repository.interface.i_user_repository import IUserRepository

router = APIRouter(prefix="/api/user")

# ------------------ brief explanation ------------------
# DI container in C# is activated with: AddScoped<IRepo, Repo>().
# DI container in Python is activated with: Depends(get_repo)
# We have to make a manual chain reaction from controller -> service -> repo
# -------------------------------------------------------

# ================= POST =================
# --------------- REGISTER ---------------
@router.post("/Register")
async def register_new_user(
        dto: UserCreateDTO,
        db: AsyncSession = Depends(get_db),
        service: IUserService = Depends(get_user_service) # <- Dep. Inj.!!
):
    user = await service.register_new_user_app(dto, db)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --------------- LOGIN ---------------
@router.post("/Login")
async def login_user(
        response: Response,
        dto: UserLoginDTO,
        db: AsyncSession = Depends(get_db),
        service: IUserService = Depends(get_user_service),
):
    result = await service.login_user_app(dto, db)
    if result is None:
        raise HTTPException(status_code=401, detail="Invalid email or password", headers={"WWW-Authenticate": "Bearer"})

    user_login_dto, ref_token_str = result

    # time in seconds, while the jwt_helper.py gets it in minutes. Very stupid, I know
    cookie_max_age = 7 * 24 * 60 * 60
    response.set_cookie(
        key="ref_token",
        value=ref_token_str,
        httponly=True,  # JS can't read it (XSS protection)
        secure=False,  # Will add it to True when the app gets HTTPS
        samesite="lax",  # It prevents sending cookies from "evil" sites (CSRF protection)
        max_age=cookie_max_age
    )

    return LoginResponseDTO(token=user_login_dto.token, user=user_login_dto.user)

# --------------- LOGOUT ---------------
@router.post("/Logout")
async def logout_user(
        response: Response,
        current_user: User = Depends(get_current_user)
):
    response.delete_cookie(
        key="ref_token",
        httponly=True,
        secure=False,
        samesite="lax",
    )

    return {"message": "User logged out"}

# --------------- REFRESH ---------------
@router.post("/Refresh")
async def refresh_token(
        response: Response,
        ref_token: str = Cookie(None), # FastAPI sees the token from cookies
        db: AsyncSession = Depends(get_db),
        service: IUserService = Depends(get_user_service)
):
    if not ref_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    result = await service.refresh_token_app(ref_token, db)

    if result is None:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    new_acc_token, new_ref_token = result

    # again we paste the new refresh token in the cookie and delete the old one
    cookie_max_age = 7 * 24 * 60 * 60
    response.set_cookie(
        key="ref_token",
        value=new_ref_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=cookie_max_age
    )

    # Now we return to the frontend ONLY new ACCESS token
    return {"access_token": new_acc_token}

# ================= GET =================
@router.get("/Profile")
async def get_user_profile(
        current_user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
        service: IUserService = Depends(get_user_service)
) -> UserResponseDTO | None:

    profile = await service.get_user_profile_app(current_user.id, db)
    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")

    return profile