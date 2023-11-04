import json
import sys
from pathlib import Path
import time
import numpy as np
import sys
from simulation.run_simulation import run_unoptimized_and_export
from db_interface import influxHandler
from Influx_Query import telemetry_query

print(sys.version)
print(sys.executable)

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
influx_query = telemetry_query()

# shortens arrays from simulation output  
# must take elements from middle of array because otherwise values of interest area all zero
def first_N_Elements(arr, n):
    arr2 = arr[0::n].copy()
    return arr2

# Runs simulation once with custom simulation params
def run_sim_once(sim_args_dict):
    """
    Run unoptimized simulation with simulation ars and export results. Refer to src/App.js to find simArgs.
    Exported results (sim_results) gets a list of the default return values for simulation results. 
    Those results are...

    default_values_keys = ["speed_kmh"(arr), "distances"(arr), "state_of_charge"(arr), "delta_energy"(arr), 
                          "solar_irradiances"(arr), "wind_speeds"(arr), "gis_route_elevations_at_each_tick"(arr), 
                          "cloud_covers", "distance_travelled"(float), "time_taken"(int), "final_soc"(float)]
    
    Remember sim_results is a list not a dict, so parsing requires integer indexing and not using keys. Index order 
    is the same order as the list above.

    """
    # Run Simulation
    sim_results = run_unoptimized_and_export(
                        values = ["speed_kmh", "distances", "state_of_charge", "delta_energy", "solar_irradiances",
                                "wind_speeds", "gis_route_elevations_at_each_tick", "cloud_covers",
                                "distance_travelled", "time_taken", "final_soc", "path_coordinates"], 
                        granularity = sim_args_dict["granularity"], 
                        golang = sim_args_dict["golang"])

    # Parse Simulation results 
    distance_travelled = sim_results[8]
    time_taken = sim_results[9]
    final_soc = sim_results[10]
    GIS_coordinates = sim_results[11]
    speed = first_N_Elements(sim_results[0], 400)
    distances = first_N_Elements(sim_results[1], 400)
    state_of_charge = first_N_Elements(sim_results[2], 400)
    delta_energy = first_N_Elements(sim_results[3], 400)
    # influx_data = json.loads(influx_hd.get_SoC_data())

    # Creating dictionary from Simulation Results
    data = {
        "distance_travelled": distance_travelled,
        "time_taken": time_taken,
        "final_soc": final_soc,
        "speed_kmh": speed,
        "distances": distances,
        "state_of_charge": state_of_charge,
        "delta_energy": delta_energy,
        # "influx_soc": influx_data,
        "GIS_coordinates": GIS_coordinates
    }

    # Write results to data JSON file
    with open("data.json", "w") as outfile:
        json.dump(data, outfile, cls=NpEncoder, indent=2)


start_time = time.time()

while True:
    current_time = time.time()
    if current_time - start_time >= 3:
        results = influx_query.get_most_recent()
        file_path = Path(__file__).parent / '..' / 'src' / 'telemetry_data.json'
        with file_path.open('w') as f:
            json.dump(results, f, indent=2)
        print("telemetry_data_queried")
        start_time = current_time

    command = input()
    # print(f"(Python Script): Received the following input from hidden renderer: {command}")
    if command.split(' ')[0] == 'run_sim': # expected: command = "run_sim" + " " + JSON String of SimArgs from front-end
        # TODO: May want to create a thread
        sim_args_dict = json.loads(command.split(' ')[1]) # Dictionary/JSON of simulation args recieved from front-end 
        run_sim_once(sim_args_dict)
        print("simulation_run_complete")
    if command == 'get_most_recent':
        fields = ['vehicle_velocity', 'state_of_charge']
        results = influx_hd.get_most_recent(fields)
        file_path = Path(__file__).parent / '..' / 'most_recent_data.json'
        with file_path.open('w') as f:
            json.dump(results, f, indent=2)
        print("most_recent_complete")

    
    
    

