import sys, random

# data = sys.argv[1]

def rng(x):
    return random.randint(0, x)

# print(rng(int(data)))
while(1):
    msg = sys.stdin()
    if msg.lower()=="done":
       print("simulation_run_complete") 
    else:
        print(sys.stdin())
