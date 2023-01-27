# Simulation-Client

This is the front-end side of the simulation application. The goal of this application is to create a local user-interface to host the simulation. We envision the final product will be capable of pulling telemetry data from a database and will allow the user to manually prompt the simulation to re-calculate as needed. It is built using a combination of Electron and React, and uses hidden windows to launch a python sub-processes where simulation data is calculated.

### Prerequisites ###

Python 3.8 or above (https://www.python.org/downloads/)

Git version control (https://git-scm.com/downloads)

### Getting Started ###

clone this repository and switch to the electron branch.

```bash
git clone https://github.com/UBC-Solar/Simulation-Client.git

git checkout electron
```
