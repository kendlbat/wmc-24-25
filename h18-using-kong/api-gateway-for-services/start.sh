#!/usr/bin/bash

if ! command -v podman &> /dev/null
then
    echo "Podman could not be found, trying to use Docker instead"
    alias podman=docker
fi

podman network create wmcnet &> /dev/null

echo "Building images"

podman build -t product-service:latest ./products > /dev/null
podman build -t rating-service:latest ./ratings > /dev/null

echo "Starting database containers"

podman run -it --replace --name product-db \
 --network wmcnet \
 -p 5001:27017 \
 --health-cmd="echo 'db.runCommand(\"ping\").ok' | mongosh mongodb://localhost:27017/ --quiet" \
 --health-interval=10s \
 --health-timeout=5s \
 --health-retries=3 \
 -d mongo &> /dev/null

podman run -it --replace --name rating-db \
 --network wmcnet \
 -p 6001:27017 \
 --health-cmd="echo 'db.runCommand(\"ping\").ok' | mongosh mongodb://localhost:27017/ --quiet" \
 --health-interval=10s \
 --health-timeout=5s \
 --health-retries=3 \
 -d mongo &> /dev/null

podman wait --condition=healthy product-db
podman wait --condition=healthy rating-db

echo "Filling demo data"

podman run --replace --name product-fill-demo-data \
 --network wmcnet \
 -e MONGODB_CONNECTION_STRING=mongodb://product-db:27017/online-shop-products \
 -e PORT=8080 \
 --entrypoint=npm \
 --rm products-service:latest run fill-demo-data &> /dev/null

podman run --replace --name rating-fill-demo-data \
 --network wmcnet \
 -e MONGODB_CONNECTION_STRING=mongodb://rating-db:27017/online-shop-ratings \
 -e PORT=8080 \
 --entrypoint=npm \
 --rm ratings-service:latest run fill-demo-data &> /dev/null

echo "Starting services"

podman run --replace --name product-service \
 --network wmcnet \
 -e MONGODB_CONNECTION_STRING=mongodb://product-db:27017/online-shop-products \
 -e PORT=8080 \
 -d product-service:latest &> /dev/null
podman run --replace --name rating-service \
 --network wmcnet \
 -e MONGODB_CONNECTION_STRING=mongodb://rating-db:27017/online-shop-ratings \
 -e PORT=8080 \
 -d rating-service:latest &> /dev/null

echo "Starting Kong Database"

podman run -d --name kong-database --network=wmcnet \
 -e "POSTGRES_USER=kong" \
 -e "POSTGRES_DB=kong" \
 -e "POSTGRES_PASSWORD=kong" \
 --health-cmd 'pg_isready -U postgres' \
 --health-interval 10s \
 --health-timeout 5s \
 --health-retries 30 \
 postgres:latest &> /dev/null

podman wait --condition=healthy kong-database

echo "Starting Kong Gateway"

podman run --rm --network=wmcnet --name kong-bootstrap \
 -e "KONG_DATABASE=postgres" \
 -e "KONG_PG_HOST=kong-database" \
 -e "KONG_PG_PASSWORD=kong" \
 kong:latest kong migrations bootstrap &> /dev/null

podman run --replace -d --name kong-gateway \
 --network=wmcnet \
 -e "KONG_DATABASE=postgres" \
 -e "KONG_PG_HOST=kong-database" \
 -e "KONG_PG_USER=kong" \
 -e "KONG_PG_PASSWORD=kong" \
 -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \
 -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \
 -e "KONG_PROXY_ERROR_LOG=/dev/stderr" \
 -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" \
 -e "KONG_ADMIN_LISTEN=0.0.0.0:8001, 0.0.0.0:8444 ssl" \
 -e "KONG_ADMIN_GUI_URL=http://localhost:8002" \
 -p 8000:8000 \
 -p 8443:8443 \
 -p 127.0.0.1:8001:8001 \
 -p 127.0.0.1:8002:8002 \
 -p 127.0.0.1:8444:8444 \
 kong:latest &> /dev/null

podman wait --condition=running kong-gateway

echo "Done"

