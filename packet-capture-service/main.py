from pyflowmeter.sniffer import create_sniffer
import os

sniffer = create_sniffer(
    # input_file='./pcap-samples/amp.UDP.isakmp.pcap',
    server_endpoint=os.environ.get("SERVER_ENDPOINT", "http://127.0.0.1:8000/send_traffic"),
    sending_interval=5,
)

sniffer.start() 
try:
    sniffer.join()
except KeyboardInterrupt:
    print('Stopping the sniffer')
    sniffer.stop()
finally:
    sniffer.join()