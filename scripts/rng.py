import sys, random

data = sys.argv[1]

def rng(x):
    return random.randint(0, x)

print(rng(int(data)))