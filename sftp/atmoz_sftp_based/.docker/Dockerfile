# Based on: https://github.com/atmoz/sftp

FROM debian:bullseye
# FROM ubuntu:latest

RUN apt-get update && \
    apt-get -y install openssh-server cron curl && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /var/run/sshd && \
    rm -f /etc/ssh/ssh_host_*key*

COPY ./check-user-changes.sh /usr/local/bin/
COPY ./check-user-changes-cron.sh /etc/cron.d/check-user-changes-cron.sh
COPY ./sshd_config /etc/ssh/sshd_config
COPY ./entrypoint.sh /
COPY ./entrypoint-restart.sh /usr/local/bin/
COPY ./entrypoint-user-create.sh /usr/local/bin/

# RUN chmod 0644 /etc/cron.d/check-user-changes-cron.sh
# RUN crontab /etc/cron.d/check-user-changes-cron.sh
RUN touch /var/log/cron.log && chmod 0777 /var/log/cron.log
RUN chmod +x /usr/local/bin/entrypoint-user-create.sh
RUN chmod +x /entrypoint.sh

# CMD cron && tail -f /var/log/cron.log

EXPOSE 22

ENTRYPOINT ["/entrypoint.sh"]