import io
import sys

# Temporarily redirect stdout so that it doesn't print
original_stdout = sys.stdout
sys.stdout = io.StringIO()

import json
import threading
from pathlib import Path
import time
import numpy as np
from simulation.run_simulation import run_unoptimized_and_export
from Influx_Query import telemetry_query

# Restore stdout
sys.stdout = original_stdout

TELEMETRY_POLLING_RATE = 3 # Rate in s to poll telemetry for new values

def send_message(message):
    print(json.dumps({"message": message}))

send_message(sys.version)
send_message(sys.executable)

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

influx_query = telemetry_query()

send_message('message_test')

def every_nth_element(arr, n):
    """Shortens arrays from simulation output, must take elements from middle of array
    because otherwise values of interest are all zero."""
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
    test_dict = {"Testing": 1, "test_2": "string", "test_3": [1,2,"3"]}
    return json.dumps(test_dict)
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
    speed = every_nth_element(sim_results[0], 400)
    distances = every_nth_element(sim_results[1], 400)
    state_of_charge = every_nth_element(sim_results[2], 400)
    delta_energy = every_nth_element(sim_results[3], 400)
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

    return data
    # Write results to data JSON file
    with open("data.json", "w") as outfile:
        json.dump(data, outfile, cls=NpEncoder, indent=2)


#def input_thread(input_queue: queue.Queue):
    #while True:
        #result = input()
        #input_queue.put(result)

#input_queue = queue.Queue()
#threading.Thread(target=input_thread, args=(input_queue,), daemon=True)

def poll_telemetry():
    while True:
        results = influx_query.get_most_recent()
        file_path = Path(__file__).parent / '..' / 'src' / 'telemetry_data.json'
        with file_path.open('w') as f:
            json.dump(results, f, indent=2)
        send_message("telemetry_data_queried")
        time.sleep(TELEMETRY_POLLING_RATE) # Poll telemetry every few seconds

threading.Thread(target=poll_telemetry, daemon=True)

poll_telemetry()

while True:
    command = input()
    if command.split(' ')[0] == 'run_sim': # expected: command = "run_sim" + " " + JSON String of SimArgs from front-end
        # TODO: May want to create a thread
        sim_args_dict = json.loads(command.split(' ')[1]) # Dictionary/JSON of simulation args recieved from front-end 
        result = run_sim_once(sim_args_dict)
        send_message(result)
        send_message("simulation_run_complete")

    if command == 'get_most_recent':
        fields = ['vehicle_velocity', 'state_of_charge']
        results = influx_hd.get_most_recent(fields)
        file_path = Path(__file__).parent / '..' / 'most_recent_data.json'
        with file_path.open('w') as f:
            json.dump(results, f, indent=2)
        send_message("most_recent_complete")
