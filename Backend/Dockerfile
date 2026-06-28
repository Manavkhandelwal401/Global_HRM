FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (libpq for psycopg2, gcc for argon2-cffi)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip first, then install all Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy Django application source
COPY . .

# Cloud Run expects PORT env var
ENV PORT=8080
EXPOSE 8080

# Start Gunicorn WSGI server
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--timeout", "120", "hrms_backend.wsgi:application"]