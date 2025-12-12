from pydantic import BaseModel
from typing import List, Optional


class ServiceStatus(BaseModel):
    name: str
    status: str
    version: str
    replicas: str
    cpu: str
    memory: str
    uptime: str


class LogEntry(BaseModel):
    timestamp: str
    level: str
    service: str
    message: str


class Alert(BaseModel):
    id: int
    severity: str
    message: str
    time: str
    service: str


class PipelineStage(BaseModel):
    name: str
    status: str
    duration: str
    timestamp: str


class SystemMetrics(BaseModel):
    time: str
    cpu: int
    memory: int
    network: int


class SystemHealth(BaseModel):
    status: str
    uptime: str
    version: str
    services: List[ServiceStatus]