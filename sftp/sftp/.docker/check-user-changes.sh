#!/bin/bash

now_time=$(date +%s)
file_path="/etc/sftp/users.conf"
file_time=$(stat -c %Y $file_path)
file_timediff=$((now_time - file_time))

echo "file_timediff: ${file_timediff}" >> /var/log/cron.log

if [ $file_timediff -lt 60 ]; then
    echo "now_time: ${now_time}"
    echo "file_path: ${file_path}"
    echo "file_time: ${file_time}"
    echo "file_timediff: ${file_timediff}"
    docker restart codewe-sftp-1
fi

