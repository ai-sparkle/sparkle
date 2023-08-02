# Use the official Conda Python image
FROM continuumio/miniconda3

# Set the working directory
WORKDIR /app

# Install build-essential libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    libgomp1

# Copy the entire application into the image
COPY . .

# Create the environment using the environment.yml file in the application
RUN conda env create -f /app/sparkle/backend/environment.yml --prefix /app/env

# Set environment variables
ENV PATH=/app/env/bin:$PATH \
    CONDA_DEFAULT_ENV=/app/env \
    CONDA_PREFIX=/app/env \
    PYTHONPATH=/app:$PYTHONPATH

# Download spacy model
RUN /app/env/bin/python -m spacy download en_core_web_lg

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "sparkle/backend/app.py"]
