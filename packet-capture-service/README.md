# Packet Capture Service

## Overview
This service is designed to capture network packets and forward them to a backend for further analysis. **It is intended to run on Linux only** because it relies on the `tcpdump` utility for live packet capture. The service has been tested on **Ubuntu 22.04 LTS** and **Ubuntu 24.04 LTS**.

## Requirements
- Python 3.11+
- `tcpdump` installed and available in your system PATH (for live capture).
- All Python dependencies in `requirements.txt`.
- Run with root privileges for live packet capture.

## Installation
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Ensure `tcpdump` is installed:
   ```bash
   sudo apt update && sudo apt install tcpdump
   ```

## Usage
Run the service with:
```bash
python main.py
```

## Configuration
Edit the configuration section at the top of `main.py` to suit your needs:

### 1. Set the Backend Endpoint
Make sure the `BACKEND_ENDPOINT` variable points to the correct `send_traffic` endpoint defined in your Backend service. Example:
```python
BACKEND_ENDPOINT = 'http://localhost:8000/api/send_traffic'
```

### 2. Choose Capture Mode
- **Live capture from network interface:**
  - **Comment out** the `input_file` line.
  - Example:
    ```python
    # input_file = 'pcap-samples/example.pcap'  # <-- comment this line
    sending_interval = 2  # seconds
    ```
- **Analyze from a pcap file:**
  - **Comment out** the `sending_interval` line.
  - **Uncomment and set** the `input_file` variable to your pcap file path.
  - Example:
    ```python
    input_file = 'pcap-samples/example.pcap'
    # sending_interval = 2  # <-- comment this line
    ```

## Notes
- The service is not supported on Windows or macOS due to the dependency on `tcpdump`.
- For best results, run with root privileges if capturing live traffic.