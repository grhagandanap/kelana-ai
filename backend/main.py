from fastapi import FastAPI
from pydantic import BaseModel
from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    recommendation_place,
    recommendation_transportation
)
from database import init_db, SessionLocal
from models.trip import Trip

class TripRequest(BaseModel):
	destination: 	str
	days: 		int
	budget:		float

app = FastAPI()

init_db()

# a GET endpoint at the root path
@app.get("/")
def home():
  return {
    "message" : "Welcome to KelanaAI"
  }

# POST endpoint — receives JSON, returns JSON
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):

    daily_budget = calculate_daily_budget(
        request.budget, request.days
    )
    category = get_trip_category(
        request.budget
    )

    trip = Trip(
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        daily_budget=daily_budget,
        category=category,
    )

    # save to db
    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)#get auto-generate id
    db.close()

    return trip

@app.get("/api/v1/trips")
def list_trips():
    db = SessionLocal()
    trips = db.query(Trip).all()
    db.close()
    return trips

@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()

    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    return trip

@app.get("/api/v1/recommendations")
def get_places(destination: str):
    return {
        "places": recommendation_place(destination)
    }

@app.get("/api/v1/transportations")
def get_transportations():
    return {
        "transportations": recommendation_transportation()
    }
