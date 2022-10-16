from more_itertools import unique_everseen
import glob


path = "./lib/resources/data-tables/"

extension = "csv"
filenames = [filepath for filepath in glob.glob(f"{path}*.{extension}")]

for file in filenames:
    with open(file, "r") as in_file, open(file.replace(".csv","-sorted.csv"), "w") as out_file:
        headers = in_file.readline()
        out_file.writelines(headers)
        out_file.writelines(sorted(unique_everseen(in_file)))
