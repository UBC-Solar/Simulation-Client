import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import json

# <----- InfluxDB constants ----->

INFLUX_URL = "https://telemetry.ubcsolar.com:8086"
INFLUX_TOKEN = "fymtfc2M7NBRZ9KGeQ8i_9dZwMYgyr6_y5l97ejzlmrLdElBzlvX2VuZVtK00Od83736zWx4PJKreK9KERzWpQ=="
INFLUX_BUCKET = "FakeTelemetryData"
INFLUX_ORG = "32acf7c91d2dff04"

# The observation window for the fields in Influx ( m for minutes, s for seconds, d for days )
TIME_WINDOW = "20m"

class telemetry_query:
    def __init__(self):
        self.client = influxdb_client.InfluxDBClient(url=INFLUX_URL, org=INFLUX_ORG, token=INFLUX_TOKEN)
        self.query_api = self.client.query_api()

    def get_SoC_data(self):
        return self.get_data(field="state_of_charge")

    def get_most_recent(self):
        result = {}
        query = f'from(bucket:"{INFLUX_BUCKET}") |> range(start: -{TIME_WINDOW}) |> filter(fn:(r) => r._measurement == "FakeTelValue") |> limit(n:1)'

        records = self.query_api.query_stream(query)
        for record in records:
            field_string = record.get_field()
            value = record.get_value()
            result[field_string] = value
        return json.dumps(result, indent=2)

