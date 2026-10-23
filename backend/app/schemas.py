from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    role: str


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class VehicleCreate(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int = 0


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    make: str
    model: str
    category: str
    price: float
    quantity: int
