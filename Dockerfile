FROM python:3.11.3-slim-buster
WORKDIR /app
COPY backend/ ./backend
COPY frontend/ ./frontend
COPY models/ ./models
COPY requirements.txt ./
COPY models.py ./

RUN pip install --no-cache-dir  -r requirements.txt
WORKDIR /app/backend
ENV PORT=8080
ENV port=$PORT
EXPOSE $PORT
CMD ["python", "app.py"]
