# DDoS Detection Web App: UI Workflow Review

## Overview
This web application demonstrates DDoS detection using Random Forest, providing tailored UI experiences for three key stakeholders:
- **Network Admin**
- **Data Scientist**
- **DevOps**

The frontend is built with React 19, TypeScript, Vite, TailwindCSS, Radix UI (shadcn/ui), Lucide icons, and Recharts for data visualization. The backend (not yet integrated) is a FastAPI service.

---

## UI Flow Explain

### 1. Network Admin
- **Landing Page** (`/`)
  - Entry point for network monitoring and DDoS alerting.
  - Visualizes network traffic and attack status (mock data).
  - Uses charts (Recharts) for traffic metrics.
  - Can trigger or view simulated DDoS attacks via context (`AttackContext`).
  - Access to quick actions and status cards.

#### Network Admin: Detailed UI Flow & Responsibilities

**Role Overview:**
Network Admins are responsible for monitoring network health, detecting anomalies, and responding to DDoS threats. The UI is designed to provide real-time visibility and actionable insights.

**UI Features:**
- **Dashboard:**
  - Displays network traffic statistics (e.g., packets/sec, bandwidth usage).
  - Shows current DDoS attack status (active/inactive, type, severity).
  - Quick access to mitigation actions (e.g., block IP, enable firewall rules).
- **Charts & Visualizations:**
  - Line/Bar charts for traffic trends and attack spikes.
  - Status cards for network segments or devices.
- **Alerts & Notifications:**
  - Visual cues for abnormal traffic or detected attacks.
  - Notification area for recent events and recommended actions.
- **Attack Simulation:**
  - Ability to trigger or stop simulated DDoS attacks for demo/testing.
  - Context-driven state management (`AttackContext`) for attack status.

**Learning Notes for Freshers:**
- Explore how network metrics are visualized using Recharts.
- Understand the use of React Context for global state (attack simulation).
- Review how UI primitives (cards, buttons, alerts) are composed for clarity and usability.

### 2. Data Scientist
- **Data Scientist Page** (`/data-scientist`)
  - Focused on dataset management and model performance.
  - Components:
    - `CreateDataset.tsx`: UI for uploading/creating datasets.
    - `DatasetPage.tsx`: View and manage datasets.
    - `CreatePreprocessing.tsx` & `DataPreprocessingPage.tsx`: Data cleaning, feature engineering, and preprocessing steps.
  - Visualizes Random Forest metrics (accuracy, confusion matrix, etc.) using Recharts.
  - Can simulate model training and evaluation (mock data).

#### Data Scientist: Detailed UI Flow & Responsibilities

**Role Overview:**
Data Scientists focus on preparing data, training models, and evaluating DDoS detection performance. The UI supports end-to-end workflow from dataset creation to model analysis.

**UI Features:**
- **Dataset Management:**
  - Upload new datasets (CSV, Excel, etc.) via `CreateDataset.tsx`.
  - View, select, and manage existing datasets in `DatasetPage.tsx`.
- **Data Preprocessing:**
  - Clean, filter, and transform data using `CreatePreprocessing.tsx` and `DataPreprocessingPage.tsx`.
  - Feature engineering options (e.g., normalization, encoding).
- **Model Training & Evaluation:**
  - Simulate training Random Forest models on selected datasets.
  - Display model metrics: accuracy, precision, recall, confusion matrix, ROC curve (mock data).
  - Visualize results with Recharts for easy interpretation.
- **Experiment Tracking:**
  - View history of model runs and parameter settings (future feature).

**Learning Notes for Freshers:**
- Study how data upload and preprocessing flows are implemented in React components.
- Observe how Recharts is used for model metric visualization.
- Understand the separation of concerns: dataset management, preprocessing, and model evaluation.

### 3. DevOps
- **DevOps Page** (`/devops`)
  - Focused on deployment, monitoring, and system health.
  - Visualizes backend service status, API health, and deployment logs (mock data).
  - UI primitives for alerts, status badges, and logs.
  - Can view simulated deployment events and system metrics.

#### DevOps: Detailed UI Flow & Responsibilities

**Role Overview:**
DevOps engineers ensure the reliability, scalability, and health of the DDoS detection system. The UI provides tools for monitoring backend services and deployment status.

**UI Features:**
- **System Monitoring:**
  - Dashboard for backend service status (FastAPI, database, etc.).
  - Health checks and uptime indicators for APIs.
- **Deployment Management:**
  - View simulated deployment logs and events (e.g., build, deploy, rollback).
  - Status badges for current deployment state (success, error, pending).
- **Alerts & Incident Tracking:**
  - Notifications for system errors, failed deployments, or service downtime.
  - Log viewer for recent incidents and troubleshooting.
- **Metrics Visualization:**
  - Charts for system resource usage (CPU, memory, response time).
  - Overview of API call statistics and error rates.

**Learning Notes for Freshers:**
- Review how system health and deployment status are represented in the UI.
- Learn how to use UI primitives for alerts, badges, and logs.
- Understand the importance of monitoring and incident response in production systems.

---

## Next Steps
- Integrate backend API for real-time data and model inference.
- Implement authentication and role-based access.
- Expand dataset and model management features.

---

## References
- See `README.md` and `.github/copilot-instructions.md` for setup and architecture details.
- Explore `components/` and `components/ui/` for reusable UI patterns.
- Backend structure in `backend/README.md`.
