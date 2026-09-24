#!/bin/bash

curl -X POST http://localhost:8191/v1 \
-H 'Content-Type: application/json' \
-d '{
  "cmd": "request.get",
  "url": "https://www.tabnews.com.br",
  "maxTimeout": 60000
}'
