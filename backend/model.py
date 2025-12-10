import time
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, accuracy_score, precision_score, recall_score
import pandas as pd
from model_inference import FEATURE_COLUMNS

router = APIRouter(prefix="/model", tags=["model"])


model_info = {}


@router.post("/train")
async def train_model(
    data_file: UploadFile = File(...),
    n_trees: int = Form(...),
    max_depth: int = Form(...),
    min_samples_split: int = Form(...),
    min_samples_leaf: int = Form(...),
    max_features: int = Form(...),
):
    if data_file.size == None:
        return HTTPException(status_code=400, detail="No file uploaded.")
    elif not data_file.filename or not data_file.filename.endswith(".csv"):
        return HTTPException(
            status_code=400, detail="Invalid file format. Please upload a CSV file."
        )
    elif data_file.size >= 50 * 1024 * 1024:
        return HTTPException(
            status_code=400, detail="File size exceeds the 50MB limit."
        )

    df = pd.read_csv(data_file.file, encoding="utf-8")
    print(df.head())
    df = df.dropna()
    X = df[FEATURE_COLUMNS]
    y = df["Label"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42
    )

    start_time_training = time.time()
    model = RandomForestClassifier(
        n_estimators=n_trees,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        max_features=max_features,
        random_state=42,
        n_jobs=-1,
        oob_score=True, 
        warm_start=True
    )
    model.fit(X_train, y_train)
    end_time_training = time.time()
    training_time = end_time_training - start_time_training

    # Build feature importances as list of dicts
    feature_importances = [
        {"feature": feature, "importance": importance}
        for feature, importance in zip(FEATURE_COLUMNS, model.feature_importances_)
    ]

    current_model_info = {
        "n_trees": n_trees,
        "max_depth": max_depth,
        "n_samples": len(X),
        "min_samples_split": min_samples_split,
        "min_samples_leaf": min_samples_leaf,
        "max_features": max_features,
        "train_size": len(X_train),
        "test_size": len(X_test),
        "train_accuracy": accuracy_score(y_train, model.predict(X_train)),
        "test_accuracy": accuracy_score(y_test, model.predict(X_test)),
        "f1_score": f1_score(y_test, model.predict(X_test), average="macro"),
        "precision": precision_score(y_test, model.predict(X_test), average="macro"),
        "recall": recall_score(y_test, model.predict(X_test), average="macro"),
        "feature_importances": feature_importances,
        "training_time_seconds": training_time,
        "oob_score": model.oob_score_,
    }
    model_info.update(current_model_info)

    joblib.dump(model, f"./models/rf_model_{int(time.time())}.pkl")
    data_file.file.close()
    return {"status": "success", "data": model_info}


@router.get("/download-model")
async def download_model():
    """Send pkl file of the trained model to client."""
    if not model_info:
        raise HTTPException(status_code=404, detail="No trained model available.")
    model_filename = f"./models/rf_model_latest.pkl"
    try:
        model = joblib.load(model_filename)
        return model
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Model file not found.")
    return JSONResponse(
        content={"status": "success", "message": "Model file ready for download."}
    )


@router.get("/info")
async def get_model_info():
    return {"status": "success", "data": model_info}
