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

influx_hd = influxHandler()

# shortens arrays from simulation output  
# must take elements from middle of array because otherwise values of interest area all zero
def first_N_Elements(arr, n):
    arr2 = arr[0::n].copy()
    return arr2

def run_sim_once():
    # run simulation 
    rawData = ex.GetSimulationData()


    shorter_speed = first_N_Elements(rawData[0].arrays[0], 400)
    shorter_distance = first_N_Elements(rawData[0].arrays[1], 400)
    shorter_SOC = first_N_Elements(rawData[0].arrays[2], 400)
    shorter_DE = first_N_Elements(rawData[0].arrays[3], 400)

    influx_data = json.loads(influx_hd.get_SoC_data())


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

    with open("data.json", "w") as outfile:
        json.dump(data, outfile, cls=NpEncoder, indent=2)

while True:
    try:
        command = input()
        # print(f"(Python Script): Received the following input from hidden renderer: {command}")
        if command == 'run_sim':
            # TODO: May want to create a thread, and print on thread.join (I think thats the syntax)
            # run_sim_once()
            print("simulation_run_complete")
        if command == 'get_most_recent':
            fields = ['vehicle_velocity', 'state_of_charge']
            results = influx_hd.get_most_recent(fields)
            print(results)
            with open('most_recent_data.json', 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2)
            print("most_recent_complete")
    except Exception as e:
        print(e)