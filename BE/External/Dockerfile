FROM python:3.9.0
WORKDIR /RMS/BE/External
COPY ./requirements.txt .
RUN pip install -r requirements.txt
EXPOSE 8080
CMD ["python", "/RMS/BE/External/app.py"]