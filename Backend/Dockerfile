FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (libpq for psycopg2, gcc for argon2)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt gunicorn

# Copy Django application source
COPY . .

# Collect static files (optional - requires DB not to be needed)
# RUN python manage.py collectstatic --noinput

# Expose Cloud Run expected port
ENV PORT=8080
EXPOSE 8080

# Start Gunicorn WSGI server
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--timeout", "120", "hrms_backend.wsgi:application"]