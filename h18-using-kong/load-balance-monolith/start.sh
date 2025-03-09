#!/usr/bin/bash

if ! command -v podman &> /dev/null
then
    echo "Podman could not be found, trying to use Docker instead"
    alias podman=docker
fi

echo "Creating network"

podman network create kong-net &> /dev/null

echo "Building image"

podman build -t online-shop:latest ./online-shop &> /dev/null

echo "Starting database"

podman run -it --replace --name shop-db-lb \
 --network kong-net \
 --health-cmd="echo 'db.runCommand(\"ping\").ok' | mongosh mongodb://localhost:27017/ --quiet" \
 --health-interval=10s \
 --health-timeout=5s \
 --health-retries=3 \
 -d mongo &> /dev/null

podman wait --condition=healthy shop-db-lb

echo "Filling demo data"

podman run --replace --name shop-fill-demo-data \
 --network kong-net \
 -e MONGODB_CONNECTION_STRING=mongodb://shop-db-lb:27017/online-shop \
 -e PORT=8080 \
 --entrypoint=npm \
 --rm online-shop:latest run fill-demo-data &> /dev/null

echo "Starting services"

podman run --replace --name shop-be-1 \
 --network kong-net \
 -e MONGODB_CONNECTION_STRING=mongodb://shop-db-lb:27017/online-shop \
 -e PORT=8080 \
 -d online-shop:latest &> /dev/null

podman run --replace --name shop-be-2 \
 --network kong-net \
 -e MONGODB_CONNECTION_STRING=mongodb://shop-db-lb:27017/online-shop \
 -e PORT=8080 \
 -d online-shop:latest &> /dev/null

echo "Starting Kong database"

podman run -d --name kong-database --network=kong-net \
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

podman run --rm --network=kong-net --name kong-bootstrap \
 -e "KONG_DATABASE=postgres" \
 -e "KONG_PG_HOST=kong-database" \
 -e "KONG_PG_PASSWORD=kong" \
 kong:latest kong migrations bootstrap &> /dev/null

podman run --replace -d --name kong-gateway \
 --network=kong-net \
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

echo "Waiting for Kong to be reachable"

while ! curl -s http://localhost:8001 &> /dev/null
do
    echo "Kong is not reachable, retrying in 5 seconds"
    sleep 5
done

echo "Configuring API Gateway"

curl -s http://localhost:8001/routes | jq -r '.data[].id' | xargs -I {} curl -X DELETE "http://localhost:8001/routes/{}"
curl -s http://localhost:8001/services | jq -r '.data[].id' | xargs -I {} curl -X DELETE "http://localhost:8001/services/{}"
curl -s http://localhost:8001/upstreams | jq -r '.data[].id' | xargs -I {} curl -X DELETE "http://localhost:8001/upstreams/{}"

UPSTREAM_ID=$(curl -s -X POST http://localhost:8001/upstreams \
  --data "name=shop-upstream" \
  --data "slots=10000" \
  --data "healthchecks.active.type=http" \
  --data "healthchecks.active.http_path=/health" | jq -r '.id')

curl -s -X POST http://localhost:8001/upstreams/${UPSTREAM_ID}/targets --data "target=shop-be-1:8080" &> /dev/null
curl -s -X POST http://localhost:8001/upstreams/${UPSTREAM_ID}/targets --data "target=shop-be-2:8080" &> /dev/null

SERVICE_ID=$(curl -s -X POST http://localhost:8001/services \
  --data "name=shop-service" \
  --data "url=http://shop-upstream" | jq -r '.id')

curl -s -X POST http://localhost:8001/services/${SERVICE_ID}/routes \
  --data "paths[]=/api" \
  --data "name=shop-route" \
  --data "strip_path=false" &> /dev/null

echo "API Gateway configured"

if ! curl -s http://localhost:8000/api/products &> /dev/null
then
    echo "Services are not reachable, exiting"
    exit 1
fi

echo "Done"