# AI-First CRM HCP Module

This is the AI-first Healthcare Professional (HCP) Customer Relationship Management tool, designed for Life Sciences pharmaceutical field reps. It integrates an intelligent conversational agent empowered by **LangGraph** & **gemma2-9b-it** via Groq, allowing reps to log interactions both via a structured form and a natural, conversational interface.

## 🚀 Features & Tech Stack

- **Frontend:** React + Redux Toolkit mapping a premium UI using Google Inter fonts.
- **Backend:** Python + FastAPI for high-performance Async endpoint serving.
- **Database:** SQLAlchemy ORM mapping over local DB (easily swappable to standard Postgres/MySQL).
- **AI Agent Framework:** LangGraph managing LLM interaction flow.
- **LLM Endpoint:** Groq Inference using the *gemma2-9b-it* LLM.

## 🛠️ LangGraph AI Tools Implemented
The LangGraph agent securely handles context via these fully integrated 5 tools:
1. `log_interaction` (Mandatory): Takes extracted conversation entities and creates a DB record payload.
2. `edit_interaction` (Mandatory): Mutates and updates an existing interaction record.
3. `fetch_hcp_profile`: Queries the dummy doctor dataset context dynamically.
4. `schedule_follow_up`: Reserves a future date record to contact an HCP based on intent.
5. `get_previous_interactions`: Recalls history of a given HCP for context-aware conversations.

## 📦 How to Run

### 1. Database Setup (PostgreSQL)
This application uses a PostgreSQL database named `Aivoa`.
1. Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/).
2. During installation, set a password for the default `postgres` user.
3. Open pgAdmin 4 (installed with PostgreSQL) or the `psql` command line tool.
4. Log in using the password you set and create a new database named `Aivoa`.

### 2. LLM Setup (Groq API Key)
The AI assistant requires a Groq API key to function.
1. Go to [GroqCloud](https://console.groq.com) and create an account.
2. Navigate to the API Keys section and create a new API key.
3. Inside the `backend/` folder, create a file named `.env`.
4. Add your Groq API key and PostgreSQL database URL to the `.env` file like this:
```env
GROQ_API_KEY=your_actual_groq_api_key_here
DATABASE_URL=postgresql://postgres:your_actual_password_here@localhost:5432/Aivoa
```
*(Replace `your_actual_password_here` with your Postgres password)*

### 3. Running the Backend API
Open a terminal inside the `/backend` folder and run:
```bash
# Create a virtual environment and activate it
python -m venv venv
venv\Scripts\activate   # (On Windows)

# Install requirements
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```
The backend API and Swagger UI will be available at `http://127.0.0.1:8000/docs`.

### 4. Running the Frontend UI
Open a **new separate terminal** inside the `/frontend` folder and run:
```bash
# Install Node modules
npm install

# Start the React development server
npm run dev
```
Visit `http://localhost:5173` to view the app!

*(Note: Use `admin@lifecrm.com` password `admin123` to log into the Admin dashboard, or create a new user account via the Sign Up tab).*



GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=your_db_url
