# Quick test script to verify connectivity from packet-capture-service to backend
import os
import requests

server_endpoint = os.environ.get("SERVER_ENDPOINT", "http://backend:8000")
try:
    r = requests.get(server_endpoint)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text}")
except Exception as e:
    print(f"Error connecting to backend: {e}")
