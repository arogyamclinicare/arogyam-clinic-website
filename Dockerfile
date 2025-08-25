# Use the official N8N Docker image
FROM n8nio/n8n:latest

# Set environment variables
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=arogyam2024
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=http
ENV GENERIC_TIMEZONE=Asia/Kolkata

# Expose the port N8N runs on
EXPOSE 5678

# Start N8N (let the image handle the startup)
CMD ["n8n"]
