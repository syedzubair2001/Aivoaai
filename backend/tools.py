from langchain_core.tools import tool
import datetime
from database import SessionLocal
import crud
import schemas

@tool
def fetch_hcp_profile(name: str) -> str:
    """Fetch profile details for a Healthcare Professional (HCP) by their name."""
    db = SessionLocal()
    try:
        hcp = crud.get_hcp_by_name(db, name)
        if hcp:
            return f"Found HCP: {hcp.name}, Specialty: {hcp.specialty}, Clinic: {hcp.clinic_name}, Location: {hcp.location}"
        return f"Could not find HCP with name: {name}"
    finally:
        db.close()

@tool
def log_interaction(hcp_name: str, duration_minutes: int, interaction_type: str, product_discussed: str, notes: str) -> str:
    """
    Log a new interaction with an HCP.
    Mandatory parameters:
    - hcp_name: name of the doctor/professional
    - duration_minutes: integer (e.g. 15, 30)
    - interaction_type: e.g. "In-Person", "Virtual", "Email"
    - product_discussed: the product that was the focus
    - notes: any qualitative notes about the interaction
    """
    db = SessionLocal()
    try:
        hcp = crud.get_hcp_by_name(db, hcp_name)
        if not hcp:
            return f"Error: Cannot log interaction, HCP '{hcp_name}' not found in database."
        
        interaction_data = schemas.InteractionCreate(
            hcp_id=hcp.id,
            duration_minutes=duration_minutes,
            interaction_type=interaction_type,
            product_discussed=product_discussed,
            notes=notes
        )
        
        created = crud.create_interaction(db, interaction_data)
        return f"Successfully logged interaction ID {created.id} with {hcp.name} on {created.date}."
    except Exception as e:
        return f"Error logging interaction: {str(e)}"
    finally:
        db.close()

@tool
def edit_interaction(interaction_id: int, notes: str = None, duration_minutes: int = None, product_discussed: str = None) -> str:
    """
    Edit an existing logged interaction. 
    You must provide the interaction_id. Then provide any of notes, duration_minutes, or product_discussed to update them.
    """
    db = SessionLocal()
    try:
        update_data = schemas.InteractionUpdate(
            notes=notes if notes != "" else None,
            duration_minutes=duration_minutes if duration_minutes != 0 else None,
            product_discussed=product_discussed if product_discussed != "" else None
        )
        updated = crud.update_interaction(db, interaction_id, update_data)
        
        if updated:
            return f"Successfully updated interaction {interaction_id}."
        return f"Could not find interaction with ID {interaction_id} to edit."
    except Exception as e:
        return f"Error editing interaction: {str(e)}"
    finally:
        db.close()

@tool
def schedule_follow_up(hcp_name: str, days_from_now: int, reason: str) -> str:
    """Schedule a follow up visit with an HCP a specific number of days from today."""
    db = SessionLocal()
    try:
        hcp = crud.get_hcp_by_name(db, hcp_name)
        if not hcp:
            return f"Cannot schedule, HCP '{hcp_name}' not found."
        
        follow_date = datetime.datetime.utcnow() + datetime.timedelta(days=days_from_now)
        scheduled = crud.schedule_follow_up(db, hcp.id, follow_date, reason)
        return f"Scheduled follow-up ID {scheduled.id} for {hcp.name} on {follow_date.date()}."
    finally:
        db.close()

@tool
def get_previous_interactions(hcp_name: str) -> str:
    """Get the history of interactions logged for a specific HCP."""
    db = SessionLocal()
    try:
        hcp = crud.get_hcp_by_name(db, hcp_name)
        if not hcp:
            return f"Cannot fetch history, HCP '{hcp_name}' not found."
        
        history = crud.get_interactions_by_hcp(db, hcp.id)
        if not history:
            return f"No previous interactions found for {hcp_name}."
            
        res = [f"ID: {i.id}, Date: {i.date.date()}, Product: {i.product_discussed}, Notes: {i.notes}" for i in history]
        return "\n".join(res)
    finally:
        db.close()

# List of all tools for the agent
tools = [
    fetch_hcp_profile, 
    log_interaction, 
    edit_interaction, 
    schedule_follow_up, 
    get_previous_interactions
]
