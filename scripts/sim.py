print("hi")
import sys
print(f"{sys.path}")

from simulation.main import ExecuteSimulation as ex

print("hi")
rawData = ex.GetSimulationData()

print(rawData)