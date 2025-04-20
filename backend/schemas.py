from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime
from models import JobStatus

# User Schemas
class UserBase(BaseModel):
    username: constr(min_length=3, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    password: constr(min_length=6)

class UserRead(UserBase):  # Inherit from UserBase to include username and email
    id: int
    credits: int

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

# Token Schema
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

# Credits Schema
class CreditsAdd(BaseModel):
    credits: int

# Job Schemas
class JobCreate(BaseModel):
    input_text: str

class JobRead(BaseModel):
    id: int
    input_text: str
    output_text: Optional[str]
    status: JobStatus
    created_at: datetime

    class Config:
        from_attributes = True

# Notification Schemas
class NotificationRead(BaseModel):
    id: int
    type: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True