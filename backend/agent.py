import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
import tools

# Initialize Groq LLM using gemma2-9b-it as requested
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

system_prompt = """You are an AI assistant built into a Life Sciences CRM platform designed for Pharmaceutical Field Reps.
Your job is to help the rep log interactions with Healthcare Professionals (HCPs).
You have a set of tools to fetch HCP profiles, log new interactions, edit interactions, view history, and schedule follow-ups.
Always use the tools when the user requests something that requires them.
Be polite and professional. Keep your responses concise as they are displayed in a chat interface.
If you logged or edited an interaction, verify it by sharing the ID returned.
"""

memory = MemorySaver()

agent_executor = create_react_agent(
    llm,
    tools.tools,
    prompt=system_prompt,
    checkpointer=memory
)

def run_chat(message: str, thread_id: str = "default_thread") -> str:
    """Takes a message from user and processes it through the LangGraph Agent."""
    config = {"configurable": {"thread_id": thread_id}}
    
    response = agent_executor.invoke(
        {"messages": [("user", message)]}, 
        config=config
    )
    
    return response["messages"][-1].content
