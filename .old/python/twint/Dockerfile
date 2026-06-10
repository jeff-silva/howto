FROM python:3.9-slim
WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir twint pandas aiohttp nest-asyncio requests
# RUN pip3 install . -r requirements.txt

CMD ["python", "app.py"]