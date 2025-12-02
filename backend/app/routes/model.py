from fastapi import APIRouter, HTTPException
from app.schemas.model import ModelTrainRequest, ModelTrainStatus, ModelMetrics
from typing import Dict, List
from app.services.prediction_service import PredictionService
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../models/best_rf_2.pkl")
predictor = PredictionService(MODEL_PATH)


router = APIRouter()


# Batch inference endpoint
@router.post("/model/predict-batch")
def predict_batch(data: List[List[float]]):
    try:
        preds = predictor.predict_batch(data)
        return {"predictions": preds}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Get model feature names
@router.get("/model/features")
def get_model_features():
    features = predictor.get_feature_names()
    if features is None:
        raise HTTPException(status_code=404, detail="Feature names not found in model.")
    return {"features": list(features), "size": len(features)}


@router.post("/model/train", response_model=ModelTrainStatus)
def train_model(request: ModelTrainRequest):
    # Mock: always start training
    return {
        "status": "training",
        "progress": 0.0,
        "started_at": "2025-11-18T10:00:00Z",
        "finished_at": None,
    }


@router.get("/model/status", response_model=ModelTrainStatus)
def get_model_status():
    # Mock: training in progress
    return {
        "status": "training",
        "progress": 0.65,
        "started_at": "2025-11-18T10:00:00Z",
        "finished_at": None,
    }


@router.get("/model/metrics", response_model=ModelMetrics)
def get_model_metrics():
    # Mock: return static metrics
    return {
        "accuracy": 0.92,
        "precision": 0.89,
        "recall": 0.91,
        "f1_score": 0.90,
        "confusion_matrix": {"TP": 120, "FP": 10, "FN": 8, "TN": 140},
    }
