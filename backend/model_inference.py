import joblib
import pandas as pd
from dotenv import load_dotenv
import os
load_dotenv()
FEATURE_COLUMNS = [
    'Packet Length Mean', 'Avg Packet Size', 'ACK Flag Count', 'Packet Length Min',
    'Fwd Packet Length Mean', 'Fwd Packet Length Min', 'Init Fwd Win Bytes',
    'Fwd Packet Length Max', 'Flow IAT Mean', 'Packet Length Max', 'Subflow Fwd Bytes',
    'Fwd Packets Length Total', 'Flow Packets/s', 'Packet Length Std', 'Idle Max',
    'Flow Bytes/s', 'Fwd IAT Max', 'Idle Std', 'Total Backward Packets', 'Fwd IAT Mean'
]
# Mapping từ FEATURE_COLUMNS sang key trong JSON
feature_to_json_key = {
    'Packet Length Mean': 'pkt_len_mean',
    'Avg Packet Size': 'pkt_size_avg',
    'ACK Flag Count': 'ack_flag_cnt',
    'Packet Length Min': 'pkt_len_min',
    'Fwd Packet Length Mean': 'fwd_pkt_len_mean',
    'Fwd Packet Length Min': 'fwd_pkt_len_min',
    'Init Fwd Win Bytes': 'init_fwd_win_byts',
    'Fwd Packet Length Max': 'fwd_pkt_len_max',
    'Flow IAT Mean': 'flow_iat_mean',
    'Packet Length Max': 'pkt_len_max',
    'Subflow Fwd Bytes': 'subflow_fwd_byts',
    'Fwd Packets Length Total': 'totlen_fwd_pkts', 
    'Flow Packets/s': 'flow_pkts_s',
    'Packet Length Std': 'pkt_len_std',
    'Idle Max': 'idle_max',
    'Flow Bytes/s': 'flow_byts_s',
    'Fwd IAT Max': 'fwd_iat_max',
    'Idle Std': 'idle_std',
    'Total Backward Packets': 'tot_bwd_pkts',
    'Fwd IAT Mean': 'fwd_iat_mean'
}
model_path = os.getenv("MODEL_PATH", "./models/random_forest_model.pkl")

model = joblib.load(model_path)

def map_json_to_features(json_data):
    """
    Chuyển đổi dữ liệu JSON nhận được thành danh sách các đặc trưng theo thứ tự của FEATURE_COLUMNS.
    """
    json_keys_to_extract = [feature_to_json_key[feature] for feature in FEATURE_COLUMNS]
    feature_values = [json_data.get(key) for key in json_keys_to_extract]
    return feature_values

def preprocessing(features):
    """
    Tiền xử lý đặc trưng đầu vào nếu cần thiết.
    
    Args:
        features (list): Danh sách các đặc trưng của luồng mạng.
        
    Returns:
        list: Danh sách các đặc trưng đã được tiền xử lý.
    """
    # Drop NaN values by replacing them with 0
    features = [0 if v is None else v for v in features]

    return features

def predict(features):
    """
    Dự đoán xem luồng mạng có phải là DDoS hay không dựa trên đặc trưng đầu vào.
    
    Args:
        features (list): Danh sách các đặc trưng của luồng mạng.
        
    Returns:
        str: Nhãn dự đoán loại DDoS (SYN, UDP, ICMP,..., Benign).
    """

    input_df = pd.DataFrame([features], columns=FEATURE_COLUMNS)
    prediction = model.predict(input_df)
    return prediction[0]  # Trả về nhãn dự đoán đầu tiên