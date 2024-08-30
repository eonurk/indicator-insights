import json
from data import __data__

def convert_to_json():
    # Convert the data to JSON format
    json_data = json.dumps(__data__, indent=2)

    # Write the JSON data to a file
    with open('market_data.json', 'w') as json_file:
        json_file.write(json_data)

    print("Data has been successfully converted to market_data.json")

if __name__ == "__main__":
    convert_to_json()