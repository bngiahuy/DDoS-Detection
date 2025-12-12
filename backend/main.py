import time
from fastapi import FastAPI, HTTPException, Request
import uvicorn
import json
from model_inference import predict, FEATURE_COLUMNS, preprocessing
import random
import pandas as pd
from fastapi import WebSocket, WebSocketDisconnect
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from devops import router as devops_router
from model import router as model_router


# Danh sách các websocket client đang kết nối
active_attack_clients = set()

test_dataset = pd.read_csv("testing-dataset.csv", encoding="utf-8")
mock_severities = ["normal", "low", "medium", "high", "critical"]
LOG_PATH = "./logs/attack_log.txt"
# Create log file if not exists
try:
    with open(LOG_PATH, "x", encoding="utf-8") as f:
        pass
except FileExistsError:
    # Delete content if already exists
    with open(LOG_PATH, "w", encoding="utf-8") as f:
        pass

app = FastAPI(
    title="DDoS Detection API",
    description="API for receiving network traffic feature data for DDoS detection.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(model_router, prefix="/api")
app.include_router(devops_router)


@app.post("/send_traffic")
async def send_traffic(request: Request):
    raw_body_bytes = await request.body()
    body_str = raw_body_bytes.decode("utf-8")
    data_dict = json.loads(body_str)
    features = [data_dict.get(col) for col in FEATURE_COLUMNS]
    features = preprocessing(features)
    label = predict(features)
    print(f"[INFO] Predicted label: {label}")
    return {
        "status": "success",
        "message": "Data received and processed.",
        "predicted_label": label,
    }


@app.get("/simulate_attack")
async def simulate_attack(status: str = "start"):
    if status == "start":
        return {
            "status": "started",
            "message": "Attack simulation started. Connect to WebSocket at /ws/simulate_attack to receive alerts.",
        }
    else:
        return {
            "status": "idle",
            "message": "No action taken. Use status=start to begin simulation.",
        }


@app.get("/get-alerts-log")
async def get_alerts_log():
    try:
        with open(LOG_PATH, "r", encoding="utf-8") as log_file:
            logs = [json.loads(line) for line in log_file.readlines()]
        return {"status": "success", "logs": logs}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Log file not found.")


# WebSocket endpoint để gửi dữ liệu dự đoán liên tục
@app.websocket("/ws/simulate_attack")
async def websocket_simulate_attack(websocket: WebSocket):
    await websocket.accept()
    active_attack_clients.add(websocket)
    try:
        for i in range(100):
            sample = test_dataset.sample(n=1).iloc[0]
            features = [sample[col] for col in FEATURE_COLUMNS]
            random_src_ip = ".".join(str(random.randint(1, 254)) for _ in range(4))
            random_dst_ip = ".".join(str(random.randint(1, 254)) for _ in range(4))
            label = predict(features)
            severity = random.choices(
                mock_severities,
                weights=(
                    [50, 20, 15, 10, 5] if label == "normal" else [5, 10, 15, 30, 40]
                ),
            )[0]
            data = {
                "sample": i + 1,
                "label": label,
                "src": random_src_ip,
                "dst": random_dst_ip,
                "severity": severity,
                "time": time.strftime("%Y-%m-%d %H:%M:%S"),
            }
            print(f"[INFO] Sending data: {data}")
            await websocket.send_json(data)
            await asyncio.sleep(0.2)  # gửi mỗi 200ms
            # Gửi xong lưu vào file log json
            with open(LOG_PATH, "a", encoding="utf-8") as log_file:
                log_file.write(json.dumps(data) + "\n")
        await websocket.close()
    except WebSocketDisconnect:
        pass
    finally:
        if websocket in active_attack_clients:
            active_attack_clients.remove(websocket)


@app.post("/health")
async def health_check():
    return {"status": "success", "message": "API is healthy and running."}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
