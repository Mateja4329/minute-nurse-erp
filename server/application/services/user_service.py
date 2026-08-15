import bcrypt
import jwt
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from application.DTOs.user.login_response_dto import LoginResponseDTO
from application.DTOs.user.user_login_dto import UserLoginDTO
from application.DTOs.user.user_create_dto import UserCreateDTO
from application.DTOs.user.user_response_dto import UserResponseDTO
from application.mappings.user_mapper import to_user_entity, to_user_response_dto
from application.security import jwt_helper
from application.services.interface.i_user_service import IUserService

from infrastructure.repository.interface.i_user_repository import IUserRepository
from infrastructure.repository.user_repository import get_user_repository


# This class automatically populates IUserService because it has a method with the same name and parameters
class UserService(IUserService):
    # Constructor and DI
    def __init__(self, repo: IUserRepository):
        self.__repo = repo

    # ================= POST =================
    # --------------- REGISTER ---------------
    async def register_new_user_app(self, dto: UserCreateDTO, db: AsyncSession) -> UserResponseDTO:
        # first we create a salt to avoid identical codes having the same hash, then we hash it and mix it with the salt
        # then we can store it in the db and decoding it makes it easier for the db to store (i think)
        salt = bcrypt.gensalt()
        hashed_bytes = bcrypt.hashpw(dto.password.encode('utf-8'), salt)
        hashed_password = hashed_bytes.decode('utf-8')

        # now we map them and save
        new_user = to_user_entity(dto, hashed_password)
        saved_user = await self.__repo.create_user_async(db, new_user)

        return to_user_response_dto(saved_user)

    # --------------- LOGIN ---------------
    async def login_user_app(
            self, dto: UserLoginDTO,
            db: AsyncSession
    ) -> tuple[LoginResponseDTO, str] | None:

        user = await self.__repo.get_user_by_email_async(db, dto.email)
        if user is None:
            return None

        is_password_valid = bcrypt.checkpw(
            dto.password.encode('utf-8'),
            user.hashed_password.encode('utf-8')
        )

        if not is_password_valid:
            return None
        access_token = jwt_helper.create_access_token(user)
        refresh_token = jwt_helper.create_refresh_token(user) #this must go to HTTP-Only cookie

        login_dto = LoginResponseDTO(
            token=access_token,
            user=to_user_response_dto(user)
        )

        return login_dto, refresh_token


    # --------------- REFRESH TOKEN ---------------
    async def refresh_token_app(self, refresh_token: str, db: AsyncSession) -> tuple[str, str] | None:
        try:
            # We must decode the token before using it, using our secret key
            payload = jwt.decode(refresh_token, jwt_helper.SECRET_KEY, algorithms=[jwt_helper.ALGORITHM])
            user_id: str = payload.get('sub')

            if not user_id:
                return None

        # If the token expired after 7 days or someone tried to hack it
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return None

        user = await self.__repo.get_user_by_id_async(db, user_id)
        if user is None:
            return None

        # Now we create new tokens for the user
        new_access_token = jwt_helper.create_access_token(user)
        new_refresh_token = jwt_helper.create_refresh_token(user)

        return new_access_token, new_refresh_token

    # ================= GET =================
    # --------------- ONE ---------------
    async def get_user_profile_app(self, user_id: str, db: AsyncSession) -> UserResponseDTO | None:
        user = await self.__repo.get_user_by_id_async(db, user_id)
        if user is None:
            return None
        return to_user_response_dto(user)



# NOW WE INSERT THE DI CONTAINER!
# We will pass this function to FastAPI to know which class to make instance of the repository
# So we can avoid calling the class and its method like it's static (confusing, i know)
# It makes service and adds repo
async def get_user_service(repo: IUserRepository = Depends(get_user_repository)) -> IUserService:
    return UserService(repo=repo) #this argument follows the constructor, be careful!