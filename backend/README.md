
# Backend DDoS Detection - User Guide

## 1. Introduction
This is a backend API using FastAPI for DDoS attack detection based on network data and machine learning models.

## 2. System Requirements
- Python 3.10 or higher (Python 3.10 or 3.11 recommended)
- pip (Python package manager)
- Operating System: Windows/Linux/MacOS

## 3. Environment Setup
### Step 1: Create and activate a virtual environment (recommended)
```bash
python -m venv venv
# Activate on Windows
venv\Scripts\activate
# Activate on Linux/MacOS
source venv/bin/activate
```

### Step 2: Install required packages
```bash
pip install -r requirements.txt
```

## 4. Run the Backend Server
```bash
uvicorn main:app --reload
```
- The server will run by default at: http://127.0.0.1:8000
- API documentation: http://127.0.0.1:8000/docs

## 5. Main Features
- **/send_traffic**: Receive network feature data, return predicted label (normal or attack)
- **/model/train**: Retrain the model with a user-uploaded CSV file
- **/devops/**: APIs for system health check, logs, alerts, etc.

## 6. Main Files Description
- `main.py`: Initializes FastAPI, defines main endpoints, integrates routers
- `model_inference.py`: Handles preprocessing and prediction using the ML model
- `model.py`: APIs for model training and evaluation
- `devops.py`: APIs for system monitoring, logs, alerts
- `schema.py`: Defines data schemas (Pydantic)
- `requirements.txt`: List of required Python packages
- `models/`: Folder containing trained model files (e.g., best_rf_2.pkl)
- `logs/`: Folder containing system logs
- `testing-dataset.csv`: Sample data file for testing

## 7. API Testing
- You can use Postman, curl, or access `/docs` directly to test the APIs.
- Example to send data to `/send_traffic`:
```bash
curl -X POST "http://127.0.0.1:8000/send_traffic" -H "Content-Type: application/json" -d '{"pkt_len_mean": 100, ...}'
```

## 8. Notes
- Make sure the model file (`models/best_rf_2.pkl`) exists before running predictions.
- If you want to retrain the model, upload a CSV file with the correct format (including all feature columns and the Label column).
- Logs will be saved in the `logs/` directory for monitoring and debugging.

