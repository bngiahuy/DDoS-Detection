import logging
import joblib
import numpy as np
from collections import OrderedDict
from scapy.all import sniff, IP, TCP
import pandas as pd

# Cấu hình Logging
logger = logging.getLogger("DDoS_Detector")

# --- CẤU HÌNH ---
# Thay thế bằng model thực tế của bạn: joblib.load('rf_model.pkl')
RF_MODEL = joblib.load("../../models/best_rf_2.pkl")
FEATURE_WINDOW_COUNT = 20  # Gom đủ 20 gói thì predict

# Danh sách 20 Features (Đúng thứ tự bạn yêu cầu)
FEATURE_COLUMNS = [
    'Packet Length Mean', 'Avg Packet Size', 'ACK Flag Count', 'Packet Length Min', 
    'Fwd Packet Length Mean', 'Fwd Packet Length Min', 'Init Fwd Win Bytes', 
    'Fwd Packet Length Max', 'Flow IAT Mean', 'Packet Length Max', 'Subflow Fwd Bytes', 
    'Fwd Packets Length Total', 'Flow Packets/s', 'Packet Length Std', 'Idle Max', 
    'Flow Bytes/s', 'Fwd IAT Max', 'Idle Std', 'Total Backward Packets', 'Fwd IAT Mean'
]

class FlowFeatures:
    def __init__(self, first_packet, direction):
        self.start_time = float(first_packet.time)
        self.last_time = float(first_packet.time)
        
        # Data Containers
        self.fwd_lens = []
        self.bwd_lens = []
        self.fwd_iats = []
        self.bwd_iats = [] # Vẫn cần để tính Flow IAT chung
        self.flow_iats = []
        
        self.last_fwd_time = None
        self.last_bwd_time = None
        
        # Flags & Counters
        self.ack_count = 0
        
        # Window
        self.init_fwd_win = 0
        
        # Add first packet
        self.update(first_packet, direction)

    def update(self, pkt, direction):
        curr_time = float(pkt.time)
        iat = curr_time - self.last_time
        if iat < 0: iat = 0
        self.flow_iats.append(iat)
        self.last_time = curr_time
        
        # Payload Length + Header (Total Packet Length)
        packet_len = len(pkt[IP]) 
        
        # Flags
        flags = pkt[TCP].flags
        if 'A' in str(flags): self.ack_count += 1
        
        if direction == 'fwd':
            if len(self.fwd_lens) == 0:
                self.init_fwd_win = pkt[TCP].window

            self.fwd_lens.append(packet_len)
            
            if self.last_fwd_time:
                self.fwd_iats.append(curr_time - self.last_fwd_time)
            self.last_fwd_time = curr_time
                
        else: # bwd
            # Vẫn cần thu thập Bwd để tính toán Flow Packets/s và Total Bwd Packets
            self.bwd_lens.append(packet_len)
            
            if self.last_bwd_time:
                self.bwd_iats.append(curr_time - self.last_bwd_time)
            self.last_bwd_time = curr_time

    def extract(self):
        # Helper function for stats
        def get_stats(data):
            if not data: return 0.0, 0.0, 0.0, 0.0 # Mean, Max, Min, Std
            return np.mean(data), np.max(data), np.min(data), np.std(data)

        all_lens = self.fwd_lens + self.bwd_lens
        duration = self.last_time - self.start_time
        if duration <= 0: duration = 1e-6

        # Tính toán các chỉ số thống kê
        pkt_mean, pkt_max, pkt_min, pkt_std = get_stats(all_lens)
        fwd_mean, fwd_max, fwd_min, _ = get_stats(self.fwd_lens)
        
        # IAT (Microseconds - chuẩn CIC-IDS)
        MICRO = 1e6
        
        flow_iat_mean, flow_iat_max, _, flow_iat_std = get_stats(self.flow_iats)
        fwd_iat_mean, fwd_iat_max, _, _ = get_stats(self.fwd_iats)
        
        # Mapping chính xác 20 Features
        feats = OrderedDict()
        
        feats['Packet Length Mean'] = pkt_mean
        feats['Avg Packet Size'] = np.mean(all_lens) if all_lens else 0
        feats['ACK Flag Count'] = self.ack_count
        feats['Packet Length Min'] = pkt_min
        feats['Fwd Packet Length Mean'] = fwd_mean
        feats['Fwd Packet Length Min'] = fwd_min
        feats['Init Fwd Win Bytes'] = self.init_fwd_win
        feats['Fwd Packet Length Max'] = fwd_max
        feats['Flow IAT Mean'] = flow_iat_mean * MICRO
        feats['Packet Length Max'] = pkt_max
        
        # Subflow Fwd Bytes xấp xỉ Fwd Packets Length Total trong ngữ cảnh đơn giản
        feats['Subflow Fwd Bytes'] = sum(self.fwd_lens) 
        feats['Fwd Packets Length Total'] = sum(self.fwd_lens)
        
        feats['Flow Packets/s'] = len(all_lens) / duration
        feats['Packet Length Std'] = pkt_std
        
        # Idle Max/Std xấp xỉ Flow IAT Max/Std
        feats['Idle Max'] = flow_iat_max * MICRO 
        
        feats['Flow Bytes/s'] = sum(all_lens) / duration
        feats['Fwd IAT Max'] = fwd_iat_max * MICRO
        
        feats['Idle Std'] = flow_iat_std * MICRO
        feats['Total Backward Packets'] = len(self.bwd_lens)
        feats['Fwd IAT Mean'] = fwd_iat_mean * MICRO
        
        return list(feats.values())

# --- MAIN LOOP ---
active_flows = {} # Key: (src_ip, dst_ip)

def predict_flow(flow_key, features):
    """Giả lập hàm Predict"""
    # Nếu có model: result = rf_model.predict([features])
    input_df = pd.DataFrame([features], columns=FEATURE_COLUMNS)
    prediction = RF_MODEL.predict(input_df)
    # print(f"features: {features}")

    print(f"Prediction for Flow {flow_key}: {prediction}")

def packet_callback(pkt):
    try:
        if not pkt.haslayer(TCP): return
        
        src = pkt[IP].src
        dst = pkt[IP].dst
        
        # --- HOST-BASED AGGREGATION (Quan trọng cho SYN Flood) ---
        if src < dst:
            key = (src, dst)
            direction = 'fwd'
        else:
            key = (dst, src)
            direction = 'bwd'
            
        # Quản lý Flow
        if key not in active_flows:
            active_flows[key] = FlowFeatures(pkt, direction)
            print(f"➕ New IP-Flow Created: {key}") 
        else:
            active_flows[key].update(pkt, direction)
            
        # Check điều kiện predict
        flow = active_flows[key]
        total_pkts = len(flow.fwd_lens) + len(flow.bwd_lens)

        if total_pkts % FEATURE_WINDOW_COUNT == 0:
            print(f"⚡ Predict Triggered for {src}->{dst} (Count: {total_pkts})")
            features_vector = flow.extract()
            print(f"features_vector: {features_vector}")
            predict_flow(key, features_vector)

    except Exception as e:
        print(f"❌ Error: {e}")


def main():
    print(f"🛡️  System Starting...")
    print(f"👉 Filter: TCP Only")
    print(f"👉 Features: {len(FEATURE_COLUMNS)} extracted")
    print("Waiting for traffic...")

    # store=0 để không lưu RAM
    # Software Loopback Interface 1 trên Windows để bắt gói từ localhost
    # Realtek 8821CE Wireless LAN 802.11ac PCI-E NIC để bắt gói từ mạng WiFi
    sniff(
        iface="Software Loopback Interface 1",
        filter="tcp",
        prn=packet_callback,
        store=0,
    )


if __name__ == "__main__":
    main()
