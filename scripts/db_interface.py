from influxdb import InfluxDBClient
import json

# open the settings JSON file and load the contents
# with open('./config/settings.json', 'r') as f:
#    settings = json.load(f)
#    print(settings)


dbinfo = {
    "host": "143.198.12.56",
    "port": 8086,
    "username": "viewer",
    "password": "viewerpass",
    "database": "Test"
}

client = InfluxDBClient(**dbinfo)
print(client.query('SELECT state_of_charge FROM daybreak_bms'))