# Kiến trúc tổng thể hệ thống DDoS Detection

## Sơ đồ kiến trúc tổng thể (ASCII)

```
+-------------------+      +-------------------+      +-------------------+
|  Thu thập dữ liệu | ---> | Tiền xử lý &      | ---> | Mô hình dự đoán   |
| (Packet Capture)  |      | Trích xuất đặc trưng|    | (Random Forest)   |
+-------------------+      +-------------------+      +-------------------+
        |                        |                          |
        v                        v                          v
+-------------------+      +-------------------+      +-------------------+
| Cảnh báo & Lưu trữ| ---> | Bảng điều khiển   | <--- | Quản lý mô hình   |
| (Log, WebSocket)  |      | & Trực quan hóa   |      | (Train, Info,    |
+-------------------+      +-------------------+      | Download, Metrics)|
                                                      +-------------------+
```

---

## 1. Thu thập dữ liệu

- **packet-capture-service/main.py**: Sử dụng thư viện `pyflowmeter` để bắt gói tin mạng, trích xuất đặc trưng, gửi dữ liệu lên backend qua API.
- **pcap-samples/**: Chứa các file mẫu gói tin mạng để kiểm thử.

## 2. Tiền xử lý và Trích xuất đặc trưng

- **backend/model_inference.py**: Định nghĩa các đặc trưng (FEATURE_COLUMNS), hàm tiền xử lý (preprocessing), chuyển đổi dữ liệu từ JSON sang đặc trưng đầu vào cho mô hình.
- **packet-capture-service**: Trích xuất đặc trưng từ gói tin thô.

## 3. Mô hình dự đoán

- **backend/model.py**: Quản lý huấn luyện, lưu trữ, tải mô hình Random Forest, API cho train/download/info.
- **backend/model_inference.py**: Hàm dự đoán (predict) sử dụng mô hình đã huấn luyện.
- **models/**: Lưu trữ file mô hình đã huấn luyện (.pkl).

## 4. Cảnh báo và Lưu trữ

- **backend/main.py**: Nhận dữ liệu, dự đoán, gửi cảnh báo qua WebSocket, ghi log cảnh báo vào file.
- **logs/attack_log.txt**: Lưu trữ lịch sử cảnh báo.
- **API /get-alerts-log, /ws/simulate_attack**: Phục vụ dữ liệu cảnh báo cho dashboard.

## 5. Bảng điều khiển & Trực quan hóa

- **src/App.tsx**: Quản lý trạng thái tấn công, WebSocket, điều hướng dashboard.
- **components/NetworkAdminPage.tsx**: Hiển thị cảnh báo, trạng thái mạng, top attacker, biểu đồ traffic.
- **components/DataScientistPage.tsx**: Hiển thị thông tin mô hình, lịch sử training, performance, feature importance, giao diện retrain.
- **components/DevOpsPage.tsx**: Hiển thị trạng thái hệ thống, pipeline, logs, metrics.

## 6. Quản lý mô hình

- **backend/model.py**: API cho train, tải, lấy info mô hình.
- **components/DataScientistPage.tsx**: Giao diện upload dataset, cấu hình hyperparameter, retrain, xem performance.
- **backend/devops.py**: API giám sát trạng thái các service, pipeline, logs, alerts, metrics.

---

# Liệt kê các mô đun chính

## Thu thập dữ liệu
- packet-capture-service/main.py
- pcap-samples/
- backend/main.py (API nhận dữ liệu)

## Tiền xử lý và Trích xuất đặc trưng
- backend/model_inference.py
- packet-capture-service (trích xuất đặc trưng)

## Mô hình dự đoán
- backend/model.py
- backend/model_inference.py
- models/

## Cảnh báo và Lưu trữ
- backend/main.py (WebSocket, ghi log)
- logs/attack_log.txt
- API /get-alerts-log, /ws/simulate_attack

## Bảng điều khiển & Trực quan hóa
- src/App.tsx
- components/NetworkAdminPage.tsx
- components/DataScientistPage.tsx
- components/DevOpsPage.tsx

## Quản lý mô hình
- backend/model.py (API train, info, download)
- components/DataScientistPage.tsx (giao diện retrain, upload)
- backend/devops.py (giám sát service, pipeline, logs, metrics)

---

Tài liệu này mô tả tổng quan kiến trúc hệ thống, các mô đun chính và luồng dữ liệu, giúp dễ dàng nắm bắt và phát triển mở rộng hệ thống.
