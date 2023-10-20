
import influxdb_client
import time
from simulation.run_simulation import run_unoptimized_and_export
from influxdb_client.client.write_api import SYNCHRONOUS
from influxdb_client import InfluxDBClient, Point


def parse_line(line):
    fields = line.split(', ')
    data = {}
    for field in fields:
        key, value = field.split(': ')
        value = value.replace("\n", "")
        data[key] = value
    return data




def main():
    # simulation_results = run_unoptimized_and_export(input_speed=None, values=None, race_type="ASC", granularity=1, golang=True)
    token = "fymtfc2M7NBRZ9KGeQ8i_9dZwMYgyr6_y5l97ejzlmrLdElBzlvX2VuZVtK00Od83736zWx4PJKreK9KERzWpQ=="
    bucket = "FakeTelemetryData"
    org = "32acf7c91d2dff04"
    # Store the URL of your InfluxDB instance
    url = "https://telemetry.ubcsolar.com:8086"

    # instantiate the client
    client = InfluxDBClient(url=url, token=token, org=org)
    write_api = client.write_api(write_options=SYNCHRONOUS)

    # Read the text file
    with open('SampleData.txt', 'r') as file:
        lines = file.readlines()

    for line in lines:
        data_point = Point("Text File Test Value").tag("Fake Telemetetry Data", "Telemetry Values")

        parsed_line = parse_line(line)
        data_line = list(parsed_line.items())
        fields = {}
        for element in data_line:
            key, value = element
            if key == "Timestamp":
                data_point.time(value)
            else:
                data_point.field(key, value)
        print(data_point)
        write_api.write(bucket=bucket, record=data_point)
        time.sleep(3)
    client.close()

if __name__ == "__main__":
    main()

