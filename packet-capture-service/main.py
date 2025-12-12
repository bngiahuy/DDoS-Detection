from pyflowmeter.sniffer import create_sniffer
import os

server_endpoint = os.getenv('BACKEND_ENDPOINT', 'http://localhost:8000/send_traffic')
sniffer = create_sniffer(
    # input_file='./pcap-samples/amp.UDP.isakmp.pcap',
    server_endpoint=server_endpoint,
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