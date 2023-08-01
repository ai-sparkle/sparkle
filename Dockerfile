# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Environment variables
ENV PYTHONUNBUFFERED True

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc g++ python3-dev

# Copy the requirements file into the image
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Remove system dependencies
RUN apt-get purge -y --auto-remove gcc g++ python3-dev

# Download SpaCy model
RUN python -m spacy download en_core_web_lg

# Copy the application into the image
COPY backend/ .

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
