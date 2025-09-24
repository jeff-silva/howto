#!/bin/sh

read -p "Username: " username
docker run --rm -t sherlock/sherlock $username