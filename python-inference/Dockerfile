FROM pytorch/pytorch:latest

WORKDIR /PyApp

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "src/server.py"]
