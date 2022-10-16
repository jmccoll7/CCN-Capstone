from dataclasses import replace
from more_itertools import unique_everseen
import os
import glob


path = input("choose a path: ")
os.chdir(path)

extension = "csv"
filenames = [i for i in glob.glob("*.{}".format(extension))]

for file in filenames:
    with open(file, "r") as in_file, open(file.replace(".csv","-sorted.csv"), "w") as out_file:
        headers = in_file.readline()
        out_file.writelines(headers)
        out_file.writelines(sorted(unique_everseen(in_file)))
