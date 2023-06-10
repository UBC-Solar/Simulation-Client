import sys
import json
import numpy as np
from simulation.main import ExecuteSimulation as ex
from db_interface import influxHandler

# numpy encoder
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)


# shortens arrays from simulation output  
# must take elements from middle of array because otherwise values of interest area all zero
def first_N_Elements(arr, n):
    startIndex = 10000
    arr2 = np.zeros(n)
    for i in range(0, n):    
        arr2[i] = arr[i + startIndex]
    return arr2

def run_sim_once():
    # run simulation 
    rawData = ex.GetSimulationData()
    shorter_speed = first_N_Elements(rawData.arrays[0], 10000)
    shorter_distance = first_N_Elements(rawData.arrays[1], 10000)
    shorter_SOC = first_N_Elements(rawData.arrays[2], 10000)
    shorter_DE = first_N_Elements(rawData.arrays[3], 10000)
    influx_hd = influxHandler()
    influx_data = json.loads(influx_hd.get_SoC_data())


    # Creating dictionary from SimulationResults
    data = {
        "distance_travelled": rawData.distance_travelled,
        "time_taken": rawData.time_taken,
        "final_soc": rawData.final_soc,
        "speed_kmh": shorter_speed,
        "distances": shorter_distance,
        "state_of_charge": shorter_SOC,
        "delta_energy": shorter_DE,
        "influx_soc": influx_data
    }
    # Writing to data.json
    with open("data.json", "w") as outfile:
        json.dump(data, outfile, cls=NpEncoder, indent=2)

while True:
    command = input()
    print(f"(Python Script): Received the following input from hidden renderer: {command}")

    if command == 'run_sim':
        # TODO: May want to create a thread, and print on thread.join (I think thats the syntax)
        run_sim_once()
        print("simulation_run_complete")