import ftplib
import zipfile
import os

ftp = ftplib.FTP('ftp.dot.state.tx.us', 'anonymous')
archive = open('sc201611.zip', 'wb')

ftp.retrbinary('RETR /pub/txdot-info/cmd/cserve/bidtab/sc201611.zip', archive.write)
zip_ref = zipfile.ZipFile('sc201611.zip', 'r')
zip_ref.extractall('sc201611')

for filename in os.listdir('sc201611'):
  file = open(f'sc201611/{filename}', 'r')
  file.read()