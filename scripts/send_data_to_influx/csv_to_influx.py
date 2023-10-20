
import influxdb_client

import pandas as pd
import random
import time
from influxdb_client.client.write_api import SYNCHRONOUS
from simulation.run_simulation import run_unoptimized_and_export



def row_operation(row):
    # simulation_results = run_unoptimized_and_export(input_speed=None, values=None, race_type="ASC", granularity=1, golang=True)
    token = "fymtfc2M7NBRZ9KGeQ8i_9dZwMYgyr6_y5l97ejzlmrLdElBzlvX2VuZVtK00Od83736zWx4PJKreK9KERzWpQ=="
    bucket = "FakeTelemetryData"
    org = "32acf7c91d2dff04"
    # Store the URL of your InfluxDB instance
    url = "https://telemetry.ubcsolar.com:8086"

    # instantiate the client
    client = influxdb_client.InfluxDBClient(
        url=url,
        token=token,
        org=org,
    )

    # configure the writer object
    write_api = client.write_api(write_options=SYNCHRONOUS)

    # Perform your operation on the row here
    keys = row.index
    p = influxdb_client.Point("sensor data").tag("TestData", "CarRunValue")
    for key in keys:
        p.field(key, row[key])
    write_api.write(bucket=bucket, org=org, record=p)
    time.sleep(10)




def main():

    df = pd.read_csv('transformed_data.csv')

    key_array = df.keys()

    df.apply(row_operation, axis=1)

    # for index, row in df.iterrows():
    #     for key in key_array:
    #         value = df._get_value(index, key)
    #         time = row * 10
    #
    #     p = influxdb_client.Point("sensor data").tag("TestData", "RandomNumber").field("time", current_time).field("value", current_value)
    #     write_api.write(bucket=bucket, org=org, record=p)
    #     time.sleep(sleep_time)
    #     sleep_time = df._get_value(i+1, "_time") - current_time

if __name__ == "__main__":
    main()

