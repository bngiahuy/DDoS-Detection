import joblib
import numpy as np
from typing import List, Any
import os
import logging

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../models/best_rf_2.pkl")
logger = logging.getLogger(__name__)


class PredictionService:
    def __init__(self, model_path: str = MODEL_PATH):
        logger.info(f"Loading model from {model_path}")
        self.model = joblib.load(model_path)
        # Try to get feature names if available
        self.feature_names = getattr(self.model, "feature_names_in_", None)

    def predict_batch(self, X: List[List[Any]]):
        X_np = np.array(X)
        preds = self.model.predict(X_np)
        logger.info("Predictions made for batch of size %d", len(X))
        return preds.tolist()

    def get_feature_names(self) -> List[str] | None:
        logger.info("Retrieving feature names from model: %s", self.feature_names)
        return self.feature_names
