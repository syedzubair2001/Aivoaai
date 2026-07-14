from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class InteractionBase(BaseModel):
    hcp_id: int
    duration_minutes: Optional[int] = None
    interaction_type: Optional[str] = None
    product_discussed: Optional[str] = None
    notes: Optional[str] = None

class InteractionCreate(InteractionBase):
    pass

class InteractionUpdate(BaseModel):
    duration_minutes: Optional[int] = None
    interaction_type: Optional[str] = None
    product_discussed: Optional[str] = None
    notes: Optional[str] = None

class InteractionResponse(InteractionBase):
    id: int
    date: datetime
    
    class Config:
        from_attributes = True

class HCPProfileBase(BaseModel):
    name: str
    specialty: str
    clinic_name: str
    location: str
    email: Optional[str] = None

class HCPProfileResponse(HCPProfileBase):
    id: int
    
    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    actions_taken: List[str] = []

class UserCreate(BaseModel):
    email: str
    password: str
    role: Optional[str] = "user"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

class InteractionTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class InteractionTypeCreate(InteractionTypeBase):
    pass

class InteractionTypeResponse(InteractionTypeBase):
    id: int

    class Config:
        from_attributes = True
