# gunicorn_config.py

# Set the listening address and port
bind = "127.0.0.1:5000"  # Adjust the IP and port as needed

# Number of worker processes
workers = 4  # You can adjust this based on your server's resources

# Worker class (use "gevent" for asynchronous workers)
worker_class = "sync"

# Maximum requests a worker will process before restarting
max_requests = 1000

# Maximum requests a worker will process before graceful reloading
max_requests_jitter = 100

# Enable or disable daemon mode (background process)
daemon = False

# Log file location
accesslog = "-"  # Log to stdout by default
errorlog = "-"   # Log to stdout by default


# To execute the file
# gunicorn -c gunicorn_config.py index:app
# lsof -i :5000
# kill <pid>