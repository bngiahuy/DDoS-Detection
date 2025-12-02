from pydantic import BaseModel
from typing import Optional, Dict


class ModelTrainRequest(BaseModel):
    dataset_id: str
    hyperparameters: Optional[Dict[str, float]] = None


class ModelTrainStatus(BaseModel):
    status: str
    progress: float
    started_at: str
    finished_at: Optional[str] = None


class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: Dict[str, int]
