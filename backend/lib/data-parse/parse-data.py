from asyncio import current_task
from datetime import datetime
import glob
import math


def bid_data_to_csv(filename):
    bid_file = open(filename, "r")
    bid_data = bid_file.readlines()
    bid_file.close()

    # Parse Project information
    county_name = bid_data[2][8:].split("  ")[0]
    project_name = bid_data[3][8:].split("  ")[0]
    file_friendly_project_name = project_name.replace(" ", "-")
    bid_date = bid_data[4][68:].split("  ")[0]

    # Write to Project data csv file
    current_time = (
        str(datetime.now()).replace(" ", "_").replace(":", "-").replace(".", "_")
    )
    project_file = open(
        "./lib/resources/parsed-bid-data/"
        + current_time
        + f"{file_friendly_project_name}-projects.csv",
        "w",
    )
    project_file.writelines(
        ["PROJECT|COUNTY|BIDDATE", f"\n{project_name}|{county_name}|{bid_date}"]
    )
    project_file.close()

    empty_line = " " * 132 + "\n"

    contractor_lines = []
    contractors = []

    # Pull out number of contractors (lines)
    new_line = bid_data[9]
    line_counter = 9
    while new_line != empty_line:
        line_counter = line_counter + 1
        new_line = bid_data[line_counter]

    contractor_lines = bid_data[9:line_counter]

    # Append to contractors list and remove commas
    for line in contractor_lines:
        if " " * 65 not in line:
            contractors.append(line[66:].split("  ")[0])

    # Set up item data list
    full_item_data = bid_data[(13 + len(contractor_lines)) :]

    variants = ["1A", "2A", "3A", "4A", "1B", "1C"]
    bad_line_content = "ALTERNATE NO. "
    bad_line_variant_list = [
        (" " * 13) + bad_line_content + variant + (" " * 103) + "\n"
        for variant in variants
    ]

    for bad_line_variant in bad_line_variant_list:
        try:
            while True:
                full_item_data.remove(bad_line_variant)
        except ValueError:
            pass

    try:
        while True:
            full_item_data.remove(empty_line)
    except ValueError:
        pass

    item_price_rows = math.ceil(len(contractors) / 3)
    number_of_items = int(len(full_item_data) / item_price_rows)
    structured_item_data = []

    for i in range(number_of_items):
        structured_item_data.append([])
        for j in range(item_price_rows):
            structured_item_data[i].append(full_item_data[(i * item_price_rows) + j])

    # Write to item price csv file, and item file. These will be two separate tables
    item_price_file = open(
        "./lib/resources/parsed-bid-data/"
        + current_time
        + f"{file_friendly_project_name}-prices.csv",
        "w",
    )
    item_price_file.write("ITEMCODE|PROJECT|QUANTITY|UNITBIDPRICE|CONTRACTOR")
    item_file = open(
        "./lib/resources/parsed-bid-data/"
        + current_time
        + f"{file_friendly_project_name}-items.csv",
        "w",
    )
    item_file.write("ITEMCODE|DESCRIPTION|UNITTYPE")

    for item in structured_item_data:
        # Standardize item code to 9 digits
        item_code = int(item[0][1:10].strip())

        item_description = item[0][14:53].strip()
        item_unit_type = item[0][53:57].strip()
        quantity = item[0][57:72].strip().replace(",", "")

        item_file.write(f"\n{item_code}|{item_description}|{item_unit_type}")

        for i in range(item_price_rows):
            for j in range(3):
                if i * 3 + j < len(contractors):
                    item_price = (
                        item[i][87 + (j * 15) : 102 + (j * 15)].strip().replace(",", "")
                    )
                    item_price_file.write(
                        f"\n{item_code}|{project_name}|{quantity}|{item_price}|{contractors[i*3+j]}"
                    )

    item_price_file.close()
    item_file.close()


def parse_all_files(folder_path):
    current_time = (
        str(datetime.now()).replace(" ", "_").replace(":", "-").replace(".", "_")
    )
    logging = (
        input("Would you like to log errors? (y/N): ").casefold() == "y".casefold()
    )
    logfile = None
    if logging:
        logfile = open(
            "./lib/resources/logs/" + current_time + "-logs.txt",
            "w",
        )
    # Function to put all file paths into a list to parse all data
    folder_names = [folder_name for folder_name in glob.glob(f"{folder_path}*")]
    filenames = []
    for folder_name in folder_names:
        filenames += [filename for filename in glob.glob(f"{folder_name}/*")]

    for filename in filenames:
        try:
            bid_data_to_csv(filename)
        except Exception as error:
            error_message = f"{current_time}: There was an error with the file: '{filename}'. Error: {error}"
            print(error_message)
            if logging:
                logfile.write(error_message + "\n")


if __name__ == "__main__":
    RAW_DATA_FOLDER = "./lib/resources/raw-bid-data/"
    choice = -1
    while choice not in [0, 1, 2]:
        print("-- Select an option --")
        print("2 - Parse all files in ./lib/resources/raw-bid-data/")
        print("1 - Parse a single file")
        print("0 - Exit")
        choice = int(input(":"))
        if choice not in [0, 1, 2]:
            print("Bad option. Try again.")

        if choice == 1:
            filename = input("Enter a file path to parse: ")
            bid_data_to_csv(filename)

        if choice == 2:
            parse_all_files(RAW_DATA_FOLDER)
