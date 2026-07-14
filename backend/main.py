from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import bcrypt


import models, schemas, crud
from database import engine, get_db, SessionLocal
import agent

# Create DB Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-First CRM HCP API", version="1.0")

# Setup CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # Seed HCPs
        hcps = crud.get_all_hcps(db)
        if not hcps:
            dummy_hcps = [
                models.HCPProfile(name="Dr. Smith", specialty="Cardiology", clinic_name="Heart Center", location="New York"),
                models.HCPProfile(name="Dr. Jones", specialty="Neurology", clinic_name="Brain Clinic", location="Boston"),
                models.HCPProfile(name="Dr. Patel", specialty="Oncology", clinic_name="Cancer Care Institute", location="Chicago")
            ]
            db.add_all(dummy_hcps)
            db.commit()
        
        # Seed default Interaction Types
        existing_types = db.query(models.InteractionType).count()
        if existing_types == 0:
            default_types = [
                models.InteractionType(name="In-Person", description="Face-to-face visit at clinic"),
                models.InteractionType(name="Virtual", description="Video call or online meeting"),
                models.InteractionType(name="Email", description="Email correspondence"),
                models.InteractionType(name="Phone Call", description="Telephone conversation"),
            ]
            db.add_all(default_types)
            db.commit()

        # Seed default Admin user
        admin = crud.get_user_by_email(db, "admin@lifecrm.com")
        if not admin:
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw("admin123".encode('utf-8'), salt).decode('utf-8')
            db.add(models.User(email="admin@lifecrm.com", hashed_password=hashed, role="admin"))
            db.commit()
    finally:
        db.close()


@app.get("/api/hcps", response_model=List[schemas.HCPProfileResponse])
def get_hcps(db: Session = Depends(get_db)):
    return crud.get_all_hcps(db)

# --- Interaction Types ---
@app.get("/api/interaction-types", response_model=List[schemas.InteractionTypeResponse])
def get_interaction_types(db: Session = Depends(get_db)):
    return db.query(models.InteractionType).all()

@app.post("/api/interaction-types", response_model=schemas.InteractionTypeResponse)
def create_interaction_type(item: schemas.InteractionTypeCreate, db: Session = Depends(get_db)):
    existing = db.query(models.InteractionType).filter(models.InteractionType.name == item.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Type already exists")
    db_item = models.InteractionType(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/api/interaction-types/{type_id}", response_model=schemas.InteractionTypeResponse)
def update_interaction_type(type_id: int, item: schemas.InteractionTypeCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.InteractionType).filter(models.InteractionType.id == type_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Not found")
    db_item.name = item.name
    db_item.description = item.description
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/interaction-types/{type_id}")
def delete_interaction_type(type_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.InteractionType).filter(models.InteractionType.id == type_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Deleted"}

@app.post("/api/hcps", response_model=schemas.HCPProfileResponse)
def create_hcp(hcp: schemas.HCPProfileBase, db: Session = Depends(get_db)):
    db_hcp = models.HCPProfile(**hcp.model_dump())
    db.add(db_hcp)
    db.commit()
    db.refresh(db_hcp)
    return db_hcp

@app.put("/api/hcps/{hcp_id}", response_model=schemas.HCPProfileResponse)
def update_hcp(hcp_id: int, hcp: schemas.HCPProfileBase, db: Session = Depends(get_db)):
    db_hcp = db.query(models.HCPProfile).filter(models.HCPProfile.id == hcp_id).first()
    if not db_hcp:
        raise HTTPException(status_code=404, detail="HCP not found")
    for key, value in hcp.model_dump().items():
        setattr(db_hcp, key, value)
    db.commit()
    db.refresh(db_hcp)
    return db_hcp

@app.delete("/api/hcps/{hcp_id}")
def delete_hcp(hcp_id: int, db: Session = Depends(get_db)):
    db_hcp = db.query(models.HCPProfile).filter(models.HCPProfile.id == hcp_id).first()
    if not db_hcp:
        raise HTTPException(status_code=404, detail="HCP not found")
    db.delete(db_hcp)
    db.commit()
    return {"message": "HCP deleted"}

@app.post("/api/interactions", response_model=schemas.InteractionResponse)
def create_interaction(interaction: schemas.InteractionCreate, db: Session = Depends(get_db)):
    return crud.create_interaction(db=db, interaction=interaction)

@app.get("/api/interactions", response_model=List[schemas.InteractionResponse])
def read_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_interactions(db, skip=skip, limit=limit)

@app.put("/api/interactions/{interaction_id}", response_model=schemas.InteractionResponse)
def update_interaction(interaction_id: int, interaction: schemas.InteractionUpdate, db: Session = Depends(get_db)):
    result = crud.update_interaction(db, interaction_id, interaction)
    if not result:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return result

@app.delete("/api/interactions/{interaction_id}")
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Interaction).filter(models.Interaction.id == interaction_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Interaction not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Interaction deleted"}

@app.post("/api/chat", response_model=schemas.ChatResponse)
def handle_chat(chat: schemas.ChatMessage):
    try:
        response = agent.run_chat(chat.message)
        return schemas.ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/signup", response_model=schemas.TokenResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), salt).decode('utf-8')
    new_user = crud.create_user(db=db, user=user, hashed_password=hashed_password)
    return {"access_token": f"token-{new_user.id}", "token_type": "bearer", "role": new_user.role}

@app.post("/api/login", response_model=schemas.TokenResponse)
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return {"access_token": f"token-{db_user.id}", "token_type": "bearer", "role": db_user.role or "user"}
