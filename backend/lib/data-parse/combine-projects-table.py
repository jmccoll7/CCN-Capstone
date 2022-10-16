# Algorithm source: freecodecamp.org
# Combines all .csvs ending in '-table.csv'

import os
import glob
import pandas as pd
from datetime import datetime

os.chdir("C:/Users/jmcco/TxDOT-ASU-Capstone/backend/lib/resources/parsed-bid-data")

extension = "csv"
filenames = [i for i in glob.glob("*-table.{}".format(extension))]

# combine all files in the list
combined_csv = pd.concat([pd.read_csv(file) for file in filenames])
# export to csv
combined_csv.to_csv(
    "C:/Users/jmcco/TxDOT-ASU-Capstone/backend/lib/resources/data-tables/"
    + datetime.now().strftime("%Y%m%d%H%M%S")
    + "-projects.csv",
    index=False,
    encoding="utf-8-sig",
)
