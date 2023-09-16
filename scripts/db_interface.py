import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import json

# <----- InfluxDB constants ----->

INFLUX_URL = "http://143.198.12.56:8086/"
INFLUX_TOKEN = "thdvwNeSQIrO367krhsxI81v8APcNNdHGOBt1kEQqPJVXRBMyyHXgmf9_zHDmm0EUHz2YTrehTuvfay7I8L9ew=="
INFLUX_BUCKET = "Test"
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
        records = self.query_api.query_stream('from(bucket:"{INFLUX_BUCKET}") |> range(start: -100d) |> filter(fn: (r) => r["_field"] == "state_of_charge")')
        vals = []
        for record in records:
            vals.append(record["_value"])
        return json.dumps(vals, indent=2)

    def get_most_recent(self, fields):
        result = {}
        for field in fields:
            query = f'from(bucket:"{INFLUX_BUCKET}") |> range(start: -100d) |> filter(fn: (r) => r["_field"] == "{field}") |> last()'
            records = self.query_api.query_stream(query)
            for record in records:
                result[field] = {"value": record['_value'],
                                 "time": record['_time'].isoformat()
                }
        return json.dumps(result, indent=2)