import sys
import json
import numpy as np
from simulation.main import ExecuteSimulation as ex
from db_interface import influxHandler

print(f"{sys.path}")

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
def first_N_Elements(arr, n):
    startIndex = 10000
    arr2 = np.zeros(n)
    for i in range(0, n):    
        arr2[i] = arr[i + startIndex]
    return arr2

# run simulation 
rawData = ex.GetSimulationData()

shorter_speed = first_N_Elements(rawData.arrays[0], 1000)
shorter_distance = first_N_Elements(rawData.arrays[1], 1000)
shorter_SOC = first_N_Elements(rawData.arrays[2], 1000)
shorter_DE = first_N_Elements(rawData.arrays[3], 1000)

influx_hd = influxHandler()
influx_data = influx_hd.get_SoC_data()

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

# Serializing json with NpEncoder
json_object = json.dumps(data, indent=4, cls=NpEncoder)

# Writing to data.json
with open("data.json", "w") as outfile:
    outfile.write(json_object)

# print to console to confirm end of run
print("simulation_run_complete")