Instructions for data parse functions:

1. -- Change to the 'backend' directory --

2. Retrieve data

-- Open in editor: './lib/data-retrieval/get-data.py'

-- Modify the following variables to control which files will be pulled
    start_year = 2022
    end_year = 2022
    start_month = 11
    end_month = 10

Run the get-data script to pull and extract files from the TXDOT FTP server.
`python ./lib/data-retrieval/get-data.py`

Remove known bad files:
./lib/resources/raw-bid-data\sc201706\07JU3202.TXT
./lib/resources/raw-bid-data\sc201709\07SP3004.TXT

3. Parse data

-- Run: `python ./lib/data-parse/parse-data.py`

Enter '2' to parse all files. Optionally you may log errors when prompted.

4. Combine and sort data:

`python.exe .\lib\data-parse\combine-items-table.py`
`python.exe .\lib\data-parse\combine-prices-table.py`
`python.exe .\lib\data-parse\combine-projects-table.py`
`python.exe .\lib\data-parse\remove-duplicates-and-sort.py`

5. Correct issues with '-items-sorted.csv' file:

> Open Excel
> Navigate to 'Data' tab at the top. Get data 'From Text/CSV'. Open '-items-sorted.csv' file.
> After importing, Navigate to 'Home' tab.
> Select 'Conditional Formatting', 'Highlight Cell Rules', 'Duplicate Values' and choose OK.
> Press the Arrow on the ITEMCODE header of the table.
> Choose Filter by color. Select the color for the duplicate values.
> Use this to clean the .csv file and ensure there are no duplicate item codes.

