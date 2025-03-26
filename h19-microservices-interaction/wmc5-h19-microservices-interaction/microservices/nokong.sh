#!/bin/bash

if ! command -v docker &> /dev/null
then
    echo "Docker could not be found, trying to use Podman instead"
    alias docker=podman
fi

docker network create wmcnet

echo "Building images"

docker build -t product-service:latest ./products > /dev/null
docker build -t rating-service:latest ./ratings > /dev/null

echo "Starting database containers"

docker run -it --replace --name product-db \
 --network wmcnet \
 -p 5001:27017 \
 --health-cmd="echo 'db.runCommand(\"ping\").ok' | mongosh mongodb://localhost:27017/ --quiet" \
 --health-interval=10s \
 --health-timeout=5s \
 --health-retries=3 \
 -d mongo &> /dev/null

docker run -it --replace --name rating-db \
 --network wmcnet \
 -p 6001:27017 \
 --health-cmd="echo 'db.runCommand(\"ping\").ok' | mongosh mongodb://localhost:27017/ --quiet" \
 --health-interval=10s \
 --health-timeout=5s \
 --health-retries=3 \
 -d mongo &> /dev/null

docker wait --condition=healthy product-db
docker wait --condition=healthy rating-db

echo "Filling demo data"

docker run --replace --name product-fill-demo-data \
 --network wmcnet \
 -e MONGODB_CONNECTION_STRING=mongodb://product-db:27017/online-shop-products \
 -e PORT=8080 \
 --entrypoint=npm \
 --rm products-service:latest run fill-demo-data &> /dev/null

docker run --replace --name rating-fill-demo-data \
 --network wmcnet \
 -e MONGODB_CONNECTION_STRING=mongodb://rating-db:27017/online-shop-ratings \
 -e PORT=8080 \
 --entrypoint=npm \
 --rm ratings-service:latest run fill-demo-data &> /dev/null

echo "Starting services"

function run_product_service {
    cd products
    MONGODB_CONNECTION_STRING=mongodb://localhost:5001/online-shop-products \
    RATING_SERVICE_URL=http://localhost:8081 \
    PORT=8080 \
    npm run start

    PID=$!
    echo "Product service running with PID $PID"
}

# run_product_service &

function run_rating_service {
    # Run rating service npm and log command for attaching to terminal
    cd ratings
    MONGODB_CONNECTION_STRING=mongodb://localhost:6001/online-shop-ratings \
    PORT=8081 \
    npm run start

    PID=$!
    echo "Rating service running with PID $PID"
}

# run_rating_service &