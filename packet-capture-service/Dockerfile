## GIAI ĐOẠN 1: BUILDER STAGE
# Sử dụng base image đầy đủ hơn để biên dịch
FROM python:3.11 AS builder

WORKDIR /app

# 1. Cài đặt các Dependencies cần thiết cho quá trình biên dịch (header files, gcc)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        # Cần cho việc biên dịch các package Python như scapy, dpkt, hoặc bất kỳ binding nào của libpcap
        gcc \
        libpcap-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. Copy files và cài đặt Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Tạo thư mục tạm để lưu trữ các thư viện đã được cài đặt
RUN mkdir -p /install && cp -R /usr/local/lib/python3.11/site-packages /install/

## GIAI ĐOẠN 2: RUNTIME STAGE
# Sử dụng base image tinh gọn và bảo mật hơn (alpine hoặc slim-buster)
FROM python:3.11-slim

# 1. Cài đặt các Dependencies RUNTIME
# Chỉ cần thư viện đã biên dịch (libpcap) và tcpdump (nếu cần cho CMD)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpcap0.8 \
        # Tùy chọn: nếu bạn chỉ dùng Python code, bạn không cần tcpdump trong image
        tcpdump \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Copy Python packages đã được cài đặt từ builder stage
# Việc này chỉ copy những gì cần thiết để chạy Python
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# 3. Copy mã nguồn ứng dụng
# CHỈ copy những gì cần thiết. Nếu có files không liên quan, hãy dùng .dockerignore.
COPY . .

# Nếu dịch vụ của bạn cần bắt gói tin (packet capture), nó có thể cần đặc quyền
# (ví dụ: NET_RAW, NET_ADMIN) được cấp cho container lúc runtime, 
# KHÔNG phải qua quyền root trong image.
ENV NET_RAW=1
ENV NET_ADMIN=1

CMD ["python", "main.py"]