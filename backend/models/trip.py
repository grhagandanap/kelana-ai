from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")

class Trip(Base):
    __tablename__ = "trips"
    
    id           = Column(Integer, primary_key=True)
    destination  = Column(String, nullable=False)
    days         = Column(Integer, nullable=False)
    budget       = Column(Float, nullable=False)
    category     = Column(String, nullable=False)
    daily_budget = Column(Float, nullable=False)
    travel_style = Column(String, nullable=False)
    ai_recommendation = Column(Text, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship("User", back_populates="trips")