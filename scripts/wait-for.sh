#!/bin/bash
# wait-for.sh

host=$1
port=$2
max_attempts=${3:-10}  # Default to 10 attempts if the third parameter is not provided

# Check if host and port are provided
if [ -z "$host" ] || [ -z "$port" ]; then
  echo "Usage: $0 <host> <port> [max_attempts]"
  exit 1
fi

# Wait for the service with a retry limit
attempt=0
while ! nc -z "$host" "$port" 2>/dev/null; do
  attempt=$((attempt + 1))

  if [ "$attempt" -ge "$max_attempts" ]; then
    echo ""
    echo "Error: $host:$port is not ready after $max_attempts attempts."
    exit 1
  fi

  echo "Attempt $attempt/$max_attempts: Waiting for $host:$port to be ready..."
  sleep 1
done

echo ""
echo "$host:$port is ready!"
exit 0
