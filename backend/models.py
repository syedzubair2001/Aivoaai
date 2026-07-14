from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50), default="user")  # 'admin' or 'user'

class InteractionType(Base):
    __tablename__ = "interaction_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    description = Column(String(255), nullable=True)

class HCPProfile(Base):
    __tablename__ = "hcp_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    specialty = Column(String(255))
    clinic_name = Column(String(255))
    location = Column(String(255))
    email = Column(String(255), nullable=True)

    interactions = relationship("Interaction", back_populates="hcp")


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_id = Column(Integer, ForeignKey("hcp_profiles.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    duration_minutes = Column(Integer, default=15)
    interaction_type = Column(String(100)) # e.g. "In-Person", "Virtual", "Email"
    product_discussed = Column(String(255))
    notes = Column(Text, nullable=True)

    hcp = relationship("HCPProfile", back_populates="interactions")
    
class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(Integer, primary_key=True, index=True)
    hcp_id = Column(Integer, ForeignKey("hcp_profiles.id"))
    date = Column(DateTime)
    reason = Column(String(255))
    status = Column(String(50), default="Scheduled") # Scheduled, Completed, Cancelled
