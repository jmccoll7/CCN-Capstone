import ftplib
import zipfile
import os

# Create archive file
archive = open('./lib/resources/raw-bid-data/sc201611.zip', 'wb')

# Connect to FTP server
ftp = ftplib.FTP('ftp.dot.state.tx.us', 'anonymous')

# Write FTP file to archive file
ftp.retrbinary('RETR /pub/txdot-info/cmd/cserve/bidtab/sc201611.zip', archive.write)
archive.close()

# Extract .zip
zip_ref = zipfile.ZipFile('./lib/resources/raw-bid-data/sc201611.zip', 'r')
zip_ref.extractall('./lib/resources/raw-bid-data/sc201611')
zip_ref.close()

# Delete .zip
os.remove('./lib/resources/raw-bid-data/sc201611.zip')