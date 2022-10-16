from importlib.resources import path
import os

if __name__ == "__main__":
    print("Enter the path for the file that needs every other line removed")
    path = input(":")

    lines = None
    with open(path, "r") as file:
        lines = file.readlines()[::2]

    os.remove(path)

    with open(path, "w") as file:
        file.writelines(lines)
