import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS

# <----- InfluxDB constants ----->

INFLUX_URL = "http://143.198.12.56:8086/"
INFLUX_TOKEN = "thdvwNeSQIrO367krhsxI81v8APcNNdHGOBt1kEQqPJVXRBMyyHXgmf9_zHDmm0EUHz2YTrehTuvfay7I8L9ew=="
INFLUX_BUCKET = "SimTest"
INFLUX_ORG = "UBC Solar"

# for record in record:
#     print(record)
    # if record["_field"] == "state_of_charge":
    #     print(f'{record["_value"]}')

class influxHandler:
    def __init__(self):
        self.client = influxdb_client.InfluxDBClient(url=INFLUX_URL, org=INFLUX_ORG, token=INFLUX_TOKEN)
        self.query_api = self.client.query_api()

    def get_SoC_data(self):
        self.records = self.query_api.query_stream('from(bucket:"Test") |> range(start: -100d) |> filter(fn: (r) => r["_field"] == "state_of_charge")')
        for record in self.records:
            print(record["_value"])

hd = influxHandler()
hd.get_SoC_data()
