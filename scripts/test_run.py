import sys, random

# data = sys.argv[1]

def rng(x):
    return random.randint(0, x)

print("Starting up edited python script")

while(True):
    print('message received by python script')
    msg = input("(From py script) Send a message, or done if done")
    if msg.lower()=="done":
        print("simulation_run_complete") 
    else:
        print("From python script: " + msg)