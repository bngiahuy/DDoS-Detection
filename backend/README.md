# Backend - DDoS Detection API

This is the backend for the DDoS Detection project, built with FastAPI. It provides API endpoints to handle data processing and DDoS detection logic.

## Directory Structure

```
backend/
├── app/                    # Main application directory
│   ├── __init__.py         # App module initialization
│   ├── main.py             # Main FastAPI application
│   ├── routes/             # API route definitions
│   │   ├── __init__.py     # Routes module initialization
│   │   └── items.py        # Example routes for items (add more as needed)
│   ├── models/             # Data model definitions
│   │   └── __init__.py     # Models module initialization
│   └── schemas/            # Pydantic schemas for validation
│       └── __init__.py     # Schemas module initialization
├── main.py                 # Server entry point
├── requirements.txt        # Python dependencies list
└── venv/                   # Virtual environment (created with python -m venv venv)
```

## Detailed Folder Explanations

### app/
The main directory containing all the FastAPI application logic. This is where we organize the code into modules.

### routes/
Contains files that define API endpoints. Each file represents a group of related routes (e.g., `items.py` for item-related endpoints). Routes are organized using FastAPI's APIRouter.

### models/
Defines the application's data models. Typically includes:
- Database models (if using an ORM like SQLAlchemy)
- Business logic models
- Classes representing system data

### schemas/
Contains Pydantic schemas for validating and serializing request/response data. Schemas help with:
- Validating incoming client data
- Defining response data structures
- Automatically generating API documentation

## How to Run

1. Activate the virtual environment:
   ```
   .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the server:
   ```
   python main.py
   ```

The server will run at `http://localhost:8000`. You can access the API documentation at `http://localhost:8000/docs`.

## Adding New Routes

To add new routes:
1. Create a new file in `app/routes/` (e.g., `users.py`)
2. Define an APIRouter in that file
3. Import and include the router in `app/main.py`

Example:
```python
from app.routes.users import router as users_router
app.include_router(users_router, prefix="/api/v1", tags=["users"])
```

## Further Development

- Add database models to `app/models/`
- Add Pydantic schemas to `app/schemas/`
- Configure database connections in `app/config.py` (if needed)
- Add middleware and dependencies in `app/dependencies.py` (if needed)