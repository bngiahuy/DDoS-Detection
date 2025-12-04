from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import uvicorn
from typing import List
import json
from model_inference import predict, FEATURE_COLUMNS, preprocessing

app = FastAPI(
    title="DDoS Detection API",
    description="API for receiving network traffic feature data for DDoS detection.",
    version="1.0.0"
)

@app.post("/send_traffic")
async def send_traffic(request: Request):
    raw_body_bytes = await request.body()
    body_str = raw_body_bytes.decode('utf-8')
    data_dict = json.loads(body_str)
    features = [data_dict.get(col) for col in FEATURE_COLUMNS]
    features = preprocessing(features)
    label = predict(features)
    print(f"Predicted label: {label}")
    return {
        "status": "success",
        "message": "Dữ liệu đặc trưng luồng mạng đã được nhận.",
        "predicted_label": label
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)