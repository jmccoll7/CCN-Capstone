from datetime import datetime
import math

def bid_data_to_csv(filename):
  bid_file = open(filename,'r')
  bid_data = bid_file.readlines()
  bid_file.close()

  county_name = bid_data[2][8:].split('  ')[0]
  project_name = bid_data[3][8:].split('  ')[0]
  file_friendly_project_name = project_name.replace(' ','-')
  bid_date = bid_data[4][68:].split('  ')[0]

  # Write to Project data csv file
  current_time = str(datetime.now()).replace(' ','_').replace(':','-').replace('.','_')
  project_file = open('./lib/resources/parsed-bid-data/' + current_time + f'{file_friendly_project_name}-table.csv', 'w')
  project_file.writelines(['PROJECT,COUNTY,BIDDATE',f'\n{project_name},{county_name},{bid_date}'])

  empty_line = ' ' * 132 + '\n'

  contractor_lines = []
  contractors = []

  # Pull out number of contractors (lines)
  new_line = bid_data[9]
  line_counter = 9
  while (new_line != empty_line):
    line_counter = line_counter + 1
    new_line = bid_data[line_counter]

  contractor_lines = bid_data[9:line_counter]

  # Append to contractors list
  for line in contractor_lines:
    contractors.append(line[66:].split('  ')[0])

  # Remove commas from contractor names
  for contractor in contractors:
    contractor.replace(',','')

  # Set up item data list
  full_item_data = bid_data[(13+len(contractor_lines)):]
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
      structured_item_data[i].append(full_item_data[(i*item_price_rows)+j])

  # Write to item price csv file
  item_file = open('./lib/resources/parsed-bid-data/' + current_time + f'{file_friendly_project_name}-prices.csv', 'w')
  item_file.write('ITEMCODE,PROJECT,QUANTITY,UNITBIDPRICE,CONTRACTOR')

  for item in structured_item_data:
    item_code = item[0][:10].replace(' ','')
    quantity = float(item[0][57:72].replace(' ','').replace(',',''))
    for i in range(item_price_rows):
      for j in range(3):
        if (i*3+j < len(contractors)):
          item_price = float(item[i][86+(j*15):101+(j*15)].replace(' ','').replace(',',''))
          item_file.write(f'\n{item_code},{project_name},{quantity},{item_price},{contractors[i*3+j]}')

  item_file.close()

if __name__ == "__main__":
  filename = input("Enter the filename to parse: ")
  bid_data_to_csv(filename)