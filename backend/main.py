from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, ConfigDict
from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    recommendation_place,
    recommendation_transportation
)
from database import init_db, get_db, SessionLocal
from models.trip import Trip, User
from models.conversation import Conversation, Message
from services.bedrock_service import get_ai_recommendation
from services.chat_service import get_chat_reply
from services.auth_service import hash_password, verify_password, create_access_token, get_current_user
from services.kb_service import retrieve_and_generate
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

class TripRequest(BaseModel):
	destination : 	str
	days        : 	int
	budget      :	float
	travel_style:	str

class UserRequest(BaseModel):
    name        : str
    email       : str
    password    : str

class LoginRequest(BaseModel):
    email       : str
    password    : str

class UserOut(BaseModel):
    id: int
    name: str | None = None
    email: str
    model_config = ConfigDict(from_attributes=True)

class QuestionRequest(BaseModel):
    question: str

class ConversationCreate(BaseModel):
    title: str

class MessageCreate(BaseModel):
    content: str

app = FastAPI()

origins = [
    "http://localhost:3000",       # Next.js dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # or ["GET", "POST", "PUT", "DELETE"]
    allow_headers=["*"],
)

init_db()

# a GET endpoint at the root path
@app.get("/")
def home():
  return {
    "message" : "Welcome to KelanaAI"
  }

# POST endpoint - register user
@app.post("/api/v1/auth/register")
async def register_user(request: UserRequest, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name = request.name,
        email = request.email,
        hashed_password = hash_password(request.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@app.post("/api/v1/auth/login")
async def login_user(request: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == request.email).first()

    # Check user exists AND password matches — don't leak which one failed
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}

# POST endpoint — receives JSON, returns JSON
@app.post("/api/v1/trips")
async def create_trip(request: TripRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    daily_budget = calculate_daily_budget(
        request.budget, request.days
    )
    category = get_trip_category(
        request.budget
    )

    trip = Trip(
        destination =request.destination,
        days        =request.days,
        budget      =request.budget,
        daily_budget=daily_budget,
        category    =category,
        travel_style=request.travel_style,
        ai_recommendation=get_ai_recommendation(
            request.destination, 
            request.days, 
            request.budget, 
            request.travel_style
        ),
        user_id     =user.id
    )

    db.add(trip)
    db.commit()
    db.refresh(trip)#get auto-generate id

    return trip

# POST endpoint — receives JSON, returns JSON
@app.post("/api/v1/trips/{trip_id}/generate")
async def generate_ai_recommendation(trip_id: int, travel_style: str):
        
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
        
    trip.ai_recommendation = get_ai_recommendation(
        trip.destination, 
        trip.days, 
        trip.budget, 
        travel_style
    )

    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()
 
    return trip

@app.get("/api/v1/trips")
def list_trips(user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    return db.query(Trip).filter(
        Trip.user_id == user.id
    ).all()

@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == user.id,
    ).first()

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

@app.put("/api/v1/trips/{trip_id}")
def update_trip(trip_id: int, update_budget: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    
    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == user.id,
    ).first()
    
    if trip is None:
        raise HTTPException(status_code=403, detail=f"Trip with id {trip_id} not found")
    
    trip.budget = update_budget
    trip.daily_budget = calculate_daily_budget(update_budget, trip.days)
    trip.category = get_trip_category(update_budget)
    
    db.add(trip)
    db.commit()
    db.refresh(trip)
    
    return trip

@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == user.id,
    ).first()

    if trip is None:
        raise HTTPException(status_code=403, detail=f"Trip with id {trip_id} not found")
    
    db.delete(trip)
    db.commit()
    
    return {"message": f"Trip with id {trip_id} deleted"}

@app.get("/api/v1/users/me", response_model=UserOut)
def get_me (user: User = Depends(get_current_user)):
    return user

@app.post("/api/v1/ask")
def ask_endpoint(request: QuestionRequest):

  # 1. Send question to Knowledge Base
  result = retrieve_and_generate(
    request.question
  )
  # 2. Return grounded answer to frontend
  return {
    "question": request.question,
    "answer": result["answer"],
    "source": result["source"]
  }

# create conversation api
@app.post("/api/v1/conversation")
def create_conversation(request: ConversationCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    conversation = Conversation (
        user_id = user.id,
        title = request.title
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


@app.get("/api/v1/conversation")
def get_conversation(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    
    conversations = db.query(Conversation).filter(Conversation.user_id == user.id).order_by(Conversation.created_at.desc()).all()

    return conversations

@app.post("/api/v1/conversation/{conversation_id}/message")
def create_message(request: MessageCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    conversation = db.query(Conversation).filter(Conversation.user_id == user.id).first()

    user_message = Message(
        conversation_id = conversation.id,
        role="user",
        content = request.content
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    history = db.query(Message).filter(Message.conversation_id == conversation.id,).order_by(Message.created_at.asc()).all()

    try:
        reply_text = get_chat_reply(history)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    # save the assistant's reply
    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=reply_text,
    )

    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)

    return assistant_message

@app.get("/api/v1/conversation/{conversation_id}/message")
def get_messages(
    conversation_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user.id,
        )
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )
    return messages