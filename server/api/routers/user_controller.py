from fastapi import APIRouter, Depends
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.user.user_create_dto import UserCreateDTO
from application.DTOs.user.user_login_dto import UserLoginDTO
from application.DTOs.user.login_response_dto import LoginResponseDTO

from application.services.interface.i_user_service import IUserService
from application.services.user_service import get_user_service

from infrastructure.database import get_db

router = APIRouter(prefix="/api/user")

# ------------------ brief explanation ------------------
# DI container in C# is activated with: AddScoped<IRepo, Repo>().
# DI container in Python is activated with: Depends(get_repo)
# We have to make a manual chain reaction from controller -> service -> repo
# -------------------------------------------------------

'''================= POST ================='''
'''--------------- REGISTER ---------------'''
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

'''--------------- LOGIN ---------------'''
@router.post("/Login")
async def login_user(
        dto: UserLoginDTO,
        db: AsyncSession = Depends(get_db),
        service: IUserService = Depends(get_user_service)
):
    result = await service.login_user_app(dto, db)
    if result is None:
        raise HTTPException(status_code=401, detail="Invalid email or password", headers={"WWW-Authenticate": "Bearer"})
    user_dto, token_str = result
    return LoginResponseDTO(token=token_str, user=user_dto)