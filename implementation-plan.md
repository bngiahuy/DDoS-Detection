# Kế hoạch triển khai: Tích hợp CICFlowMeter & DDoS Attack Simulation

## Tổng quan dự án
**Mục tiêu:** Tích hợp CICFlowMeter với Random Forest model để phát hiện DDoS attack real-time trong vòng 2 tuần.

**Công nghệ sử dụng:**
- Frontend: React 19 + TypeScript + Vite + TailwindCSS + shadcn/ui
- Backend: FastAPI + Python
- Network Analysis: CICFlowMeter (Java)
- Attack Simulation: Scapy + hping3
- Model: Random Forest (scikit-learn)

---

## TUẦN 1: Backend Foundation & Attack Simulation

### 📅 Ngày 1-2: Setup môi trường & Dependencies

#### ✅ Todo List
- [ ] **1.1. Cài đặt công cụ phân tích mạng**
  - [ ] Download và cài đặt Wireshark (bao gồm tshark CLI)
  - [ ] Verify tshark hoạt động: `tshark --version`
  - [ ] Download CICFlowMeter từ GitHub
  - [ ] Test CICFlowMeter với sample PCAP file

- [ ] **1.2. Cài đặt công cụ tấn công**
  - [ ] Cài đặt Python Scapy: `pip install scapy`
  - [ ] (Optional) Cài đặt hping3 (nếu dùng Linux/WSL)
  - [ ] Test Scapy: tạo và gửi 1 packet đơn giản
  - [ ] Verify quyền admin/root để gửi raw packets

- [ ] **1.3. Setup backend dependencies**
  - [ ] Tạo/activate venv: `python -m venv venv`
  - [ ] Cài đặt dependencies mới vào `backend/requirements.txt`:
    ```
    scapy>=2.5.0
    pandas>=2.0.0
    numpy>=1.24.0
    scikit-learn>=1.3.0
    joblib>=1.3.0
    ```
  - [ ] Install: `pip install -r requirements.txt`
  - [ ] Verify imports: `python -c "import scapy; import pandas"`

- [ ] **1.4. Cấu trúc thư mục backend**
  - [ ] Tạo `backend/data/uploads/` cho PCAP files
  - [ ] Tạo `backend/data/flows/` cho CICFlowMeter output
  - [ ] Tạo `backend/data/models/` cho trained models
  - [ ] Tạo `backend/scripts/` cho attack simulation scripts
  - [ ] Tạo `backend/app/services/` nếu chưa có
  - [ ] Add `.gitignore` entries cho data folders

**Deliverable:** Môi trường development sẵn sàng với đầy đủ tools

---

### 📅 Ngày 3-4: Attack Simulation Scripts

#### ✅ Todo List
- [ ] **2.1. Tạo Traffic Generator cơ bản**
  - [ ] Tạo file `backend/scripts/traffic_generator.py`
  - [ ] Implement class `TrafficGenerator` với methods:
    - [ ] `normal_traffic()` - tạo HTTP requests bình thường
    - [ ] `attack_traffic()` - tạo flood traffic
    - [ ] `start_attack()` - khởi động multi-threaded attack
    - [ ] `stop_attack()` - dừng attack gracefully
  - [ ] Test với local HTTP server: `python -m http.server 8080`
  - [ ] Verify traffic bằng tshark: `tshark -i lo -f "tcp port 8080"`

- [ ] **2.2. Tạo Scapy-based attack simulator**
  - [ ] Tạo file `backend/scripts/simulate_ddos.py`
  - [ ] Implement attack types:
    - [ ] `syn_flood()` - SYN Flood attack
    - [ ] `udp_flood()` - UDP Flood attack
    - [ ] `icmp_flood()` - ICMP Flood attack
  - [ ] Add CLI arguments parsing (target IP, duration, attack type)
  - [ ] Test mỗi attack type riêng biệt
  - [ ] Measure packets/second rate

- [ ] **2.3. Tạo Attack Controller Service**
  - [ ] Tạo file `backend/app/services/attack_simulator.py`
  - [ ] Implement class `AttackSimulator`:
    - [ ] `start_simulation()` - async method khởi động attack
    - [ ] `stop_simulation()` - dừng attack
    - [ ] `get_status()` - trạng thái hiện tại
    - [ ] Track attack state (running/stopped)
  - [ ] Integrate với subprocess để chạy Scapy scripts
  - [ ] Add logging cho attack events

- [ ] **2.4. Testing & Validation**
  - [ ] Test attack simulation trên localhost
  - [ ] Capture traffic với tshark trong khi attack
  - [ ] Verify traffic rate tăng đáng kể khi attack
  - [ ] Document attack parameters (threads, duration, etc.)

**Deliverable:** Attack simulation scripts hoạt động, có thể tạo traffic DDoS giả lập

---

### 📅 Ngày 5-6: CICFlowMeter Integration

#### ✅ Todo List
- [ ] **3.1. CICFlowMeter Wrapper Service**
  - [ ] Tạo file `backend/app/services/cicflowmeter_service.py`
  - [ ] Implement class `CICFlowMeterService`:
    - [ ] `__init__()` - setup jar path và output directory
    - [ ] `process_pcap()` - xử lý PCAP file, trả về DataFrame
    - [ ] `validate_output()` - kiểm tra CSV output hợp lệ
    - [ ] Handle errors (missing jar, invalid pcap, etc.)
  - [ ] Test với sample PCAP file từ internet
  - [ ] Verify CSV output structure

- [ ] **3.2. Packet Capture Service**
  - [ ] Extend `CICFlowMeterService` với capture methods:
    - [ ] `start_capture()` - bắt đầu capture với tshark
    - [ ] `stop_capture()` - dừng và save PCAP file
    - [ ] `capture_duration()` - capture trong X giây
  - [ ] Implement auto-processing sau khi capture xong
  - [ ] Add queue/scheduling cho multiple captures
  - [ ] Test capture + process workflow

- [ ] **3.3. Feature Extraction & Preprocessing**
  - [ ] Tạo file `backend/app/services/preprocessing_service.py`
  - [ ] Implement `PreprocessingService`:
    - [ ] `load_flows()` - load CSV từ CICFlowMeter
    - [ ] `clean_data()` - handle missing values, outliers
    - [ ] `select_features()` - chọn features cho model
    - [ ] `normalize()` - scale features về [0, 1] hoặc standard scale
    - [ ] `prepare_for_model()` - format cho Random Forest input
  - [ ] Research features cần thiết từ CICFlowMeter output
  - [ ] Test preprocessing với sample data

- [ ] **3.4. Integration Testing**
  - [ ] Test end-to-end flow: Capture → CICFlowMeter → Preprocessing
  - [ ] Measure processing time cho different PCAP sizes
  - [ ] Validate DataFrame schema consistency
  - [ ] Document expected features và data types

**Deliverable:** CICFlowMeter integration hoàn chỉnh, có thể extract features từ PCAP

---

### 📅 Ngày 7: Random Forest Model Service

#### ✅ Todo List
- [ ] **4.1. Model Training (nếu chưa có)**
  - [ ] Download dataset DDoS (CIC-DDoS2019 hoặc tương tự)
  - [ ] Script training `backend/scripts/train_model.py`
  - [ ] Train Random Forest với scikit-learn
  - [ ] Save model: `joblib.dump(model, 'backend/data/models/random_forest.pkl')`
  - [ ] Document training parameters và accuracy

- [ ] **4.2. Prediction Service**
  - [ ] Tạo file `backend/app/services/prediction_service.py`
  - [ ] Implement class `PredictionService`:
    - [ ] `__init__()` - load trained model
    - [ ] `predict()` - predict single/batch flows
    - [ ] `predict_proba()` - confidence scores
    - [ ] `analyze_pcap()` - end-to-end PCAP → predictions
  - [ ] Integrate với `CICFlowMeterService` và `PreprocessingService`
  - [ ] Add result aggregation (attack percentage, severity)

- [ ] **4.3. Result Schema**
  - [ ] Tạo file `backend/app/schemas/detection.py`
  - [ ] Define Pydantic models:
    - [ ] `DetectionResult` - kết quả phân tích
    - [ ] `FlowPrediction` - prediction cho từng flow
    - [ ] `AttackSummary` - tổng hợp attack statistics
  - [ ] Add validation và example values

- [ ] **4.4. Testing**
  - [ ] Test prediction với sample flows
  - [ ] Test với normal traffic PCAP
  - [ ] Test với attack traffic PCAP (từ simulation)
  - [ ] Verify prediction accuracy

**Deliverable:** Model service hoàn chỉnh, có thể predict từ PCAP files

---

## TUẦN 2: API Development & Frontend Integration

### 📅 Ngày 8-9: Backend API Endpoints

#### ✅ Todo List
- [ ] **5.1. Detection API Routes**
  - [ ] Tạo file `backend/app/routes/detection.py`
  - [ ] Implement endpoints:
    - [ ] `POST /api/detection/analyze-pcap` - upload & analyze PCAP
    - [ ] `POST /api/detection/start-capture` - bắt đầu capture
    - [ ] `GET /api/detection/status` - capture status
    - [ ] `GET /api/detection/results` - lấy kết quả mới nhất
  - [ ] Add file upload handling (UploadFile)
  - [ ] Add background tasks cho long-running processes
  - [ ] Implement error handling và status codes

- [ ] **5.2. Simulation API Routes**
  - [ ] Tạo file `backend/app/routes/simulation.py`
  - [ ] Implement endpoints:
    - [ ] `POST /api/simulation/start` - khởi động attack simulation
    - [ ] `POST /api/simulation/stop` - dừng simulation
    - [ ] `GET /api/simulation/status` - trạng thái attack
    - [ ] `GET /api/simulation/types` - list attack types available
  - [ ] Add request/response models
  - [ ] Add validation cho attack parameters

- [ ] **5.3. Main App Integration**
  - [ ] Update `backend/app/main.py`:
    - [ ] Include detection router
    - [ ] Include simulation router
    - [ ] Add CORS middleware cho frontend
    - [ ] Add startup/shutdown events
  - [ ] Configure API documentation (Swagger)
  - [ ] Add health check endpoint

- [ ] **5.4. API Testing**
  - [ ] Test tất cả endpoints với Postman/curl
  - [ ] Test file upload workflow
  - [ ] Test concurrent requests
  - [ ] Document API usage với examples
  - [ ] Update `backend/README.md` với API docs

**Deliverable:** Backend API hoàn chỉnh và tested

---

### 📅 Ngày 10-11: Frontend API Integration

#### ✅ Todo List
- [ ] **6.1. API Client Service**
  - [ ] Tạo file `src/services/detectionApi.ts`
  - [ ] Implement API methods:
    - [ ] `analyzePcap(file)` - upload PCAP
    - [ ] `startCapture(interface)` - start capture
    - [ ] `getDetectionStatus()` - poll status
    - [ ] `getResults()` - fetch results
  - [ ] Add TypeScript interfaces cho responses
  - [ ] Add error handling wrapper

- [ ] **6.2. Simulation API Client**
  - [ ] Extend `detectionApi.ts` với simulation methods:
    - [ ] `startSimulation(attackType)` - bắt đầu attack
    - [ ] `stopSimulation()` - dừng attack
    - [ ] `getSimulationStatus()` - check status
  - [ ] Add request/response types
  - [ ] Implement retry logic cho failed requests

- [ ] **6.3. API Context/State Management**
  - [ ] Tạo `src/contexts/DetectionContext.tsx`
  - [ ] Implement Context:
    - [ ] State: detectionResults, isAnalyzing, error
    - [ ] Methods: analyzeTraffic, startMonitoring
  - [ ] Wrap App với DetectionProvider
  - [ ] Update existing `AttackContext` nếu cần

- [ ] **6.4. Integration Testing**
  - [ ] Test API calls từ browser DevTools
  - [ ] Test error scenarios (network error, 404, 500)
  - [ ] Verify CORS configuration
  - [ ] Test file upload với large PCAPs

**Deliverable:** Frontend có thể gọi backend APIs

---

### 📅 Ngày 12: Network Admin Page Enhancement

#### ✅ Todo List
- [ ] **7.1. Attack Control Panel**
  - [ ] Update `components/NetworkAdminPage.tsx`
  - [ ] Add UI section "Attack Simulation Control":
    - [ ] Dropdown chọn attack type (SYN, UDP, ICMP)
    - [ ] Input field cho target IP (default localhost)
    - [ ] Slider cho attack duration
    - [ ] Button "Start Attack" (destructive variant)
    - [ ] Button "Stop Attack"
  - [ ] Integrate với `detectionApi.startSimulation()`
  - [ ] Add loading states và disabled states

- [ ] **7.2. Detection Results Display**
  - [ ] Add section "Detection Results":
    - [ ] Card hiển thị latest analysis
    - [ ] Show: total flows, attack flows, attack percentage
    - [ ] Color-coded severity (green/yellow/red)
    - [ ] Timestamp của analysis
  - [ ] Add alert banner khi attack detected
  - [ ] Use Lucide icons (AlertCircle, Shield, CheckCircle)

- [ ] **7.3. Real-time Status Monitoring**
  - [ ] Add status cards:
    - [ ] "Capture Status" - đang capture hay không
    - [ ] "Attack Status" - simulation running hay stopped
    - [ ] "Last Analysis" - thời gian analysis gần nhất
  - [ ] Implement auto-refresh (polling mỗi 5s)
  - [ ] Add manual refresh button

- [ ] **7.4. Charts & Visualizations**
  - [ ] Add Recharts LineChart cho traffic over time
  - [ ] Add PieChart cho attack vs normal traffic ratio
  - [ ] Add BarChart cho attack types distribution
  - [ ] Use mock data với option load từ API

**Deliverable:** Network Admin Page với attack control và detection display

---

### 📅 Ngày 13: Complete Workflow & Polish

#### ✅ Todo List
- [ ] **8.1. End-to-End Workflow Implementation**
  - [ ] Implement "Quick Start" button trong NetworkAdminPage:
    - [ ] Click → Start attack simulation
    - [ ] Auto start capture sau 2s
    - [ ] Capture trong 30s
    - [ ] Auto analyze PCAP
    - [ ] Display results
  - [ ] Add progress indicator cho từng step
  - [ ] Add step-by-step status updates

- [ ] **8.2. Data Scientist Page Integration**
  - [ ] Update `components/DataScientistPage.tsx`
  - [ ] Add "Upload PCAP for Analysis" section
  - [ ] Integrate với `detectionApi.analyzePcap()`
  - [ ] Display detailed metrics (precision, recall, F1)
  - [ ] Show confusion matrix với Recharts

- [ ] **8.3. DevOps Page Monitoring**
  - [ ] Update `components/DevOpsPage.tsx`
  - [ ] Add "Service Health" section:
    - [ ] CICFlowMeter status
    - [ ] Model service status
    - [ ] API response times
  - [ ] Add "Recent Activity" log viewer
  - [ ] Show system metrics (CPU, memory if available)

- [ ] **8.4. Error Handling & UX Polish**
  - [ ] Add toast notifications cho success/error events
  - [ ] Add loading skeletons cho data fetching
  - [ ] Improve error messages (user-friendly)
  - [ ] Add confirmation dialogs cho destructive actions
  - [ ] Add tooltips cho technical terms

**Deliverable:** Complete end-to-end workflow với polished UI

---

### 📅 Ngày 14: Testing, Documentation & Demo Prep

#### ✅ Todo List
- [ ] **9.1. Integration Testing**
  - [ ] Test complete workflow 5 lần:
    - [ ] Start attack → Capture → Analyze → Results
  - [ ] Test với different attack types
  - [ ] Test error scenarios (wrong IP, no permissions)
  - [ ] Test với normal traffic (no attack)
  - [ ] Measure end-to-end timing

- [ ] **9.2. Documentation Updates**
  - [ ] Update `README.md`:
    - [ ] Add "Quick Start" guide
    - [ ] Add architecture diagram
    - [ ] Add screenshots
  - [ ] Update `workflow-review.md` với actual implementation
  - [ ] Create `DEMO.md` với demo script
  - [ ] Document known limitations

- [ ] **9.3. Demo Preparation**
  - [ ] Prepare demo dataset/PCAP files
  - [ ] Create demo script với talking points
  - [ ] Test demo flow 3 lần
  - [ ] Prepare fallback nếu live demo fails
  - [ ] Record video demo (backup)

- [ ] **9.4. Code Cleanup**
  - [ ] Remove unused imports
  - [ ] Remove console.logs và debug code
  - [ ] Format code (Prettier, Black)
  - [ ] Add comments cho complex logic
  - [ ] Run linting: `pnpm lint`

- [ ] **9.5. Final Checklist**
  - [ ] Verify tất cả dependencies trong requirements.txt
  - [ ] Verify tất cả npm packages
  - [ ] Test trên fresh environment (clone mới)
  - [ ] Check CORS configuration
  - [ ] Verify .gitignore (không commit data files)
  - [ ] Tag release version

**Deliverable:** Production-ready demo application với documentation

---

## Phân công công việc (nếu làm team)

### Backend Developer
- Ngày 1-7: Attack simulation, CICFlowMeter integration, Model service
- Ngày 8-9: API endpoints
- Ngày 10-14: Support frontend integration, testing

### Frontend Developer
- Ngày 1-2: Setup, review API specs
- Ngày 3-9: Prepare UI components, mock data
- Ngày 10-13: API integration, UI polish
- Ngày 14: Testing, documentation

### Full-stack (solo)
- Follow timeline as-is
- Prioritize backend first (Ngày 1-9)
- Then frontend integration (Ngày 10-13)

---

## Risk Mitigation

### Rủi ro cao
1. **CICFlowMeter không chạy được**
   - Backup: Parse PCAP manually với Scapy
   - Backup: Dùng pre-generated CSV files

2. **Attack simulation bị block bởi firewall**
   - Solution: Test trên localhost/loopback
   - Solution: Dùng VM/Docker network

3. **Model accuracy thấp**
   - Acceptable: Đây là demo, focus vào workflow
   - Solution: Dùng pre-trained model từ research papers

### Rủi ro trung bình
1. **Performance issues với large PCAPs**
   - Solution: Limit file size upload (< 10MB)
   - Solution: Add processing timeout

2. **CORS issues**
   - Solution: Configure FastAPI CORS middleware correctly
   - Solution: Test với Postman trước khi frontend integration

---

## Success Criteria

### Must Have (Bắt buộc)
- ✅ Attack simulation hoạt động (ít nhất 1 attack type)
- ✅ CICFlowMeter có thể process PCAP
- ✅ Model predict được từ CICFlowMeter output
- ✅ UI có button Start/Stop attack
- ✅ UI hiển thị "ATTACK DETECTED" khi có attack

### Nice to Have (Nếu có thời gian)
- ⭐ Multiple attack types
- ⭐ Real-time monitoring (polling)
- ⭐ Detailed charts và metrics
- ⭐ DevOps monitoring page

### Demo Requirements
- 📹 Video demo 2-3 phút
- 📊 Slides presentation
- 💻 Live demo workflow (< 2 phút)

---

## Notes & Tips

### Performance Tips
- Limit PCAP size: 5-10MB maximum
- Use batch processing, không cần real-time
- Cache model predictions

### Development Tips
- Test backend endpoints với Postman trước
- Dùng mock data trong frontend ban đầu
- Commit thường xuyên (mỗi feature)
- Backup data files quan trọng

### Presentation Tips
- Focus vào workflow, không phải technical details
- Prepare demo script
- Have backup screenshots/video
- Explain practical use cases

---

**Tổng kết:** Kế hoạch này chia nhỏ công việc thành 60+ tasks cụ thể, có thể hoàn thành trong 2 tuần với effort ~6-8 giờ/ngày. Priority cao nhất là attack simulation + basic detection workflow.