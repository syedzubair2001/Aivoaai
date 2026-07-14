from sqlalchemy.orm import Session
import models, schemas

def get_hcp(db: Session, hcp_id: int):
    return db.query(models.HCPProfile).filter(models.HCPProfile.id == hcp_id).first()

def get_hcp_by_name(db: Session, name: str):
    return db.query(models.HCPProfile).filter(models.HCPProfile.name.ilike(f"%{name}%")).first()

def get_interactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Interaction).order_by(models.Interaction.date.desc()).offset(skip).limit(limit).all()

def create_interaction(db: Session, interaction: schemas.InteractionCreate):
    db_interaction = models.Interaction(**interaction.model_dump())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

def update_interaction(db: Session, interaction_id: int, interaction_data: schemas.InteractionUpdate):
    db_interaction = db.query(models.Interaction).filter(models.Interaction.id == interaction_id).first()
    if not db_interaction:
        return None
    
    update_data = interaction_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_interaction, key, value)
        
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

def get_interactions_by_hcp(db: Session, hcp_id: int):
    return db.query(models.Interaction).filter(models.Interaction.hcp_id == hcp_id).all()

def schedule_follow_up(db: Session, hcp_id: int, date, reason: str):
    db_followup = models.FollowUp(hcp_id=hcp_id, date=date, reason=reason)
    db.add(db_followup)
    db.commit()
    db.refresh(db_followup)
    return db_followup

def get_all_hcps(db: Session):
    return db.query(models.HCPProfile).all()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(email=user.email, hashed_password=hashed_password, role=user.role or "user")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
