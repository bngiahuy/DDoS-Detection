import random
from fastapi import APIRouter
from app.schemas.system import (
    ServiceStatus,
    LogEntry,
    Alert,
    PipelineStage,
    SystemMetrics,
    SystemHealth,
)
from typing import List

router = APIRouter()


@router.get("/health", response_model=SystemHealth)
def get_health():
    return {
        "status": "operational",
        "uptime": "12d 5h",
        "version": "v1.0.0",
        "services": [
            {
                "name": "ml-inference-api",
                "status": "running",
                "version": "v2.4.1",
                "replicas": "3/3",
                "cpu": "42%",
                "memory": "1.8 GB",
                "uptime": "12d 5h",
            },
            {
                "name": "traffic-collector",
                "status": "running",
                "version": "v1.9.3",
                "replicas": "5/5",
                "cpu": "68%",
                "memory": "3.2 GB",
                "uptime": "12d 5h",
            },
            {
                "name": "alert-manager",
                "status": "running",
                "version": "v3.1.0",
                "replicas": "2/2",
                "cpu": "12%",
                "memory": "512 MB",
                "uptime": "12d 5h",
            },
            {
                "name": "model-trainer",
                "status": "degraded",
                "version": "v2.4.0",
                "replicas": "1/2",
                "cpu": "89%",
                "memory": "4.1 GB",
                "uptime": "2h 34m",
            },
            {
                "name": "metrics-exporter",
                "status": "running",
                "version": "v1.2.1",
                "replicas": "3/3",
                "cpu": "8%",
                "memory": "256 MB",
                "uptime": "12d 5h",
            },
        ],
    }


@router.get("/services", response_model=List[ServiceStatus])
def get_services():
    return [
        {
            "name": "ml-inference-api",
            "status": "running",
            "version": "v2.4.1",
            "replicas": "3/3",
            "cpu": "42%",
            "memory": "1.8 GB",
            "uptime": "12d 5h",
        },
        {
            "name": "traffic-collector",
            "status": "running",
            "version": "v1.9.3",
            "replicas": "5/5",
            "cpu": "68%",
            "memory": "3.2 GB",
            "uptime": "12d 5h",
        },
        {
            "name": "alert-manager",
            "status": "running",
            "version": "v3.1.0",
            "replicas": "2/2",
            "cpu": "12%",
            "memory": "512 MB",
            "uptime": "12d 5h",
        },
        {
            "name": "model-trainer",
            "status": "degraded",
            "version": "v2.4.0",
            "replicas": "1/2",
            "cpu": "89%",
            "memory": "4.1 GB",
            "uptime": "2h 34m",
        },
        {
            "name": "metrics-exporter",
            "status": "running",
            "version": "v1.2.1",
            "replicas": "3/3",
            "cpu": "8%",
            "memory": "256 MB",
            "uptime": "12d 5h",
        },
    ]


@router.get("/logs", response_model=List[LogEntry])
def get_logs():
    return [
        {
            "timestamp": "10:30:42",
            "level": "INFO",
            "service": "ml-inference-api",
            "message": "Prediction request processed successfully",
        },
        {
            "timestamp": "10:30:38",
            "level": "WARN",
            "service": "model-trainer",
            "message": "High memory usage detected: 4.1GB/4.5GB",
        },
        {
            "timestamp": "10:30:35",
            "level": "ERROR",
            "service": "model-trainer",
            "message": "Replica 2 failed health check, attempting restart",
        },
        {
            "timestamp": "10:30:32",
            "level": "INFO",
            "service": "traffic-collector",
            "message": "Processed 45,230 packets in last minute",
        },
        {
            "timestamp": "10:30:28",
            "level": "INFO",
            "service": "alert-manager",
            "message": "Critical alert sent to Network Admin dashboard",
        },
        {
            "timestamp": "10:30:25",
            "level": "WARN",
            "service": "ml-inference-api",
            "message": "Response time exceeded threshold: 245ms",
        },
        {
            "timestamp": "10:30:21",
            "level": "INFO",
            "service": "metrics-exporter",
            "message": "Metrics exported to Prometheus",
        },
    ]


@router.get("/alerts", response_model=List[Alert])
def get_alerts():
    return [
        {
            "id": 1,
            "severity": "critical",
            "message": "Model trainer service degraded - 1/2 replicas running",
            "time": "2 min ago",
            "service": "model-trainer",
        },
        {
            "id": 2,
            "severity": "warning",
            "message": "High CPU usage on inference API pods (>80%)",
            "time": "5 min ago",
            "service": "ml-inference-api",
        },
        {
            "id": 3,
            "severity": "warning",
            "message": "Network bandwidth approaching limit (85%)",
            "time": "8 min ago",
            "service": "traffic-collector",
        },
    ]


@router.get("/metrics", response_model=List[SystemMetrics])
def get_metrics(is_attack: bool = False):
    # Mock data ranges
    CPU_RANGE = (20, 70) if not is_attack else (70, 95)
    MEMORY_RANGE = (50, 70) if not is_attack else (70, 99)
    NETWORK_RANGE = (300, 1500) if not is_attack else (1000, 2000)
    # Danh sách thời gian (giữ nguyên để dễ theo dõi)
    times = ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30"]

    metrics_list = []

    for t in times:
        # Tạo giá trị ngẫu nhiên trong khoảng đã định
        random_cpu = random.randint(CPU_RANGE[0], CPU_RANGE[1])
        random_memory = random.randint(MEMORY_RANGE[0], MEMORY_RANGE[1])
        random_network = random.randint(NETWORK_RANGE[0], NETWORK_RANGE[1])

        metrics_list.append(
            {
                "time": t,
                "cpu": random_cpu,
                "memory": random_memory,
                "network": random_network,
            }
        )

    return metrics_list


@router.get("/pipeline", response_model=List[PipelineStage])
def get_pipeline():
    return [
        {
            "name": "Source",
            "status": "success",
            "duration": "2s",
            "timestamp": "10:15:23",
        },
        {
            "name": "Build",
            "status": "success",
            "duration": "45s",
            "timestamp": "10:16:08",
        },
        {
            "name": "Test",
            "status": "success",
            "duration": "1m 23s",
            "timestamp": "10:17:31",
        },
        {
            "name": "Security Scan",
            "status": "success",
            "duration": "34s",
            "timestamp": "10:18:05",
        },
        {
            "name": "Deploy to Staging",
            "status": "success",
            "duration": "28s",
            "timestamp": "10:18:33",
        },
        {
            "name": "Integration Tests",
            "status": "running",
            "duration": "12s",
            "timestamp": "10:18:45",
        },
        {
            "name": "Deploy to Production",
            "status": "pending",
            "duration": "-",
            "timestamp": "-",
        },
    ]
