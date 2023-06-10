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
# must take elements from middle of array because otherwise values of interest area all zero
def first_N_Elements(arr, n):
    arr2 = arr[0::n].copy()
    return arr2

# run simulation 
rawData = ex.GetSimulationData()


shorter_speed = first_N_Elements(rawData[0].arrays[0], 400)
shorter_distance = first_N_Elements(rawData[0].arrays[1], 400)
shorter_SOC = first_N_Elements(rawData[0].arrays[2], 400)
shorter_DE = first_N_Elements(rawData[0].arrays[3], 400)
# shorter_GIS = first_N_Elements(rawData[1], 10000)

influx_hd = influxHandler()
influx_data = json.loads(influx_hd.get_SoC_data())

print(rawData[1])
# Creating dictionary from SimulationResults
data = {
    "distance_travelled": rawData[0].distance_travelled,
    "time_taken": rawData[0].time_taken,
    "final_soc": rawData[0].final_soc,
    "speed_kmh": shorter_speed,
    "distances": shorter_distance,
    "state_of_charge": shorter_SOC,
    "delta_energy": shorter_DE,
    "influx_soc": influx_data,
    "GIS_coordinates": rawData[1],
}

# Serializing json with NpEncoder
json_object = json.dumps(data, indent=4, cls=NpEncoder)

# Writing to data.json
with open("data.json", "w") as outfile:
    outfile.write(json_object)

# print to console to confirm end of run
print("simulation_run_complete")