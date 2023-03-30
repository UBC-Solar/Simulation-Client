import numpy as np
import time

from simulation.main.ExecuteSimulation import GetSimulationData
from simulation.main.SimulationResult import SimulationResult
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS

# <----- Constants ----->

CAR_NAME = "Brightside"

# <----- InfluxDB constants ----->

INFLUX_URL = "http://localhost:8086/"
INFLUX_TOKEN = "thdvwNeSQIrO367krhsxI81v8APcNNdHGOBt1kEQqPJVXRBMyyHXgmf9_zHDmm0EUHz2YTrehTuvfay7I8L9ew=="

INFLUX_BUCKET = "SimTest"
INFLUX_ORG = "UBC Solar"

# <----- Script constants ----->

UPSCALE_FACTOR = 1.25
DOWNSCALE_FACTOR = 0.8
NOISE_FACTOR = 0.01
SECONDS_PER_DATA_WRITE = 1
SOURCE = "simulation_script"
ALTER_ARRAY_KEYS = [0,2,5]
UPLOAD_ARRAY_KEYS = [0,1,2,4,5]
MEASUREMENTS = ["speed_kmph", "distance", "state_of_charge", "solar_irradiances","wind_speeds"]

'''
Description: Alter the data from a SimulationResult object and upload its data to the InfluxDB
'''

def main():
  sim_result = GetSimulationData()
  writeData(sim_result)
  return

def writeData(simulation_result: SimulationResult):
    '''
    Write the Simultation data from a SimulationResult object to the InfluxDB Database at the specfic rate
    '''
    client = influxdb_client.InfluxDBClient(url=INFLUX_URL, org=INFLUX_ORG, token=INFLUX_TOKEN)
    write_api = client.write_api(write_options=SYNCHRONOUS)

    for tick in range(len(simulation_result.arrays[0])):
        #now = time.time()

        p = influxdb_client.Point(f"{SOURCE} {tick}") \
        .tag("car", CAR_NAME) \
        .field(MEASUREMENTS[0], simulation_result.arrays[UPLOAD_ARRAY_KEYS[0]][tick]) \
        .field(MEASUREMENTS[1], simulation_result.arrays[UPLOAD_ARRAY_KEYS[1]][tick]) \
        .field(MEASUREMENTS[2], simulation_result.arrays[UPLOAD_ARRAY_KEYS[2]][tick]) \
        .field(MEASUREMENTS[3], simulation_result.arrays[UPLOAD_ARRAY_KEYS[3]][tick]) \
        .field(MEASUREMENTS[4], simulation_result.arrays[UPLOAD_ARRAY_KEYS[4]][tick])

        write_api.write(bucket=INFLUX_BUCKET, org=INFLUX_ORG, record=p)

        #elapsed = time.time() - now
        #time.sleep(SECONDS_PER_DATA_WRITE - elapsed)

        if (tick == 10):
            break

def addNoise(simulation_result: SimulationResult) -> SimulationResult:
    '''
    Add gaussian noise to the simulation results data
    '''
    for array_key in ALTER_ARRAY_KEYS:
        simulation_result.arrays[array_key] += np.random.normal(0, np.mean(simulation_result.arrays[array_key]) * NOISE_FACTOR, len(simulation_result.arrays[array_key]))
        simulation_result.arrays[array_key][simulation_result.arrays[array_key] < 0] = 0

    return simulation_result

def scaleUpResults(simulation_result: SimulationResult) -> SimulationResult:
    '''
    Scale up the values contained within SimulationResult arrays
    '''
    for array_key in ALTER_ARRAY_KEYS:
        simulation_result.arrays[array_key] = simulation_result.arrays[array_key] * UPSCALE_FACTOR

    return simulation_result

def scaleDownResults(simulation_result: SimulationResult) -> SimulationResult:
    '''
    Scale down the values contained within SimulationResult arrays
    '''
    for array_key in ALTER_ARRAY_KEYS:
        simulation_result.arrays[array_key] = simulation_result.arrays[array_key] * DOWNSCALE_FACTOR

    return simulation_result

def printResults(simulation_result: SimulationResult):
    '''
    Print all the fields of the SimulationResult object and compare to the unchanged results
    '''
    unchanged_result = GetSimulationData()
    array_names = {
        0: "Speed KM/H",
        1: "Distances",
        2: "State of Charge",
        3: "Delta Energy",
        4: "Solar Irradiances",
        5: "Wind Speeds",
        6: "GIS Route Elevation",
        7: "Cloud Covers",
    }

    for i in range(8):
        print(array_names[i] + ": ")
        print("Original :")
        print(unchanged_result.arrays[i])
        print("Modified :")
        print(simulation_result.arrays[i])
        print('\n')
    
    print(f'Distance Travelled: {simulation_result.distance_travelled}')
    print(f'Time taken: {simulation_result.time_taken}')
    print(f'Final SOC: {simulation_result.final_soc}')

def printArray(simulation_result: SimulationResult, array_key: int):
    '''
    Print all the values from a specified SimulationResult array
    '''
    for element in simulation_result.arrays[array_key]:
        print(element)

if __name__ == "__main__":
    main()
   