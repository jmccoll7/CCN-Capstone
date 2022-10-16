import ftplib
import zipfile
import os

def pull_folder(folder_name, app_lib_path, ftp_path):
  
  FTP_SERVER = "ftp.dot.state.tx.us"
  # Create empty archive file
  archive = None
  try:
      archive = open(f"{app_lib_path}{folder_name}.zip", "wb")
  except:
      exit("You should be in the 'backend' folder. Is the path correct?")

  # Connect to FTP server
  ftp = ftplib.FTP(FTP_SERVER, "anonymous")

  # Write FTP file to archive file
  try:
    ftp.retrbinary(f"RETR {ftp_path}{folder_name}.zip", archive.write)
    archive.close()
  except:
    print(f"Folder {folder_name} not found on FTP server. Removing the created archive...")
    os.remove(f"{app_lib_path}{folder_name}.zip")


def extract_and_remove_archive(folder_name, app_lib_path):
    # Extract .zip
    if (os.path.exists(f"{app_lib_path}{folder_name}.zip")):
      zip_ref = zipfile.ZipFile(f"{app_lib_path}{folder_name}.zip", "r")
      zip_ref.extractall(f"{app_lib_path}{folder_name}")
      zip_ref.close()


def pull_folder_and_extract(folder_name, app_lib_path, ftp_path):
    pull_folder(folder_name, app_lib_path, ftp_path)
    extract_and_remove_archive(folder_name, app_lib_path)

    # Delete .zip
    os.remove(f"{app_lib_path}{folder_name}.zip")


if __name__ == "__main__":
    start_year = 2022
    end_year = 2022
    start_month = 11
    end_month = 10
    mid_years = [i for i in range(start_year + 1, end_year)]

    app_lib_path = "./lib/resources/raw-bid-data/"
    ftp_path = "/pub/txdot-info/cmd/cserve/bidtab/"

    for month in range(start_month, 13):
        folder_name = f"sc{start_year}{'%02d' % month}"
        pull_folder_and_extract(folder_name, app_lib_path, ftp_path)

    for year in mid_years:
        for month in range(1, 13):
            folder_name = f"sc{year}{'%02d' % month}"
            pull_folder_and_extract(folder_name, app_lib_path, ftp_path)

    for month in range(1, end_month):
        folder_name = f"sc{end_year}{'%02d' % month}"
        pull_folder_and_extract(folder_name, app_lib_path, ftp_path)
