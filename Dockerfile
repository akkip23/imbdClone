# Use an official Nginx runtime as a base image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy all HTML, CSS, and JavaScript files from your local machine to the container
COPY index.html .
COPY static_tosterMsg.css .
COPY static_tosterMsg.js .
COPY style.css .
COPY script.js .

# Expose port 80 to allow outside access
EXPOSE 80
