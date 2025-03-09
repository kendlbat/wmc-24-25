# Using Kong

## Start Kong

```bash
podman network create kong-net

podman run -d --name kong-database --network=kong-net -e "POSTGRES_USER=kong" -e "POSTGRES_DB=kong" -e "POSTGRES_PASSWORD=kong" postgres:latest

podman run --rm --network=kong-net \
 -e "KONG_DATABASE=postgres" \
 -e "KONG_PG_HOST=kong-database" \
 -e "KONG_PG_PASSWORD=kong" \
kong:latest kong migrations bootstrap

podman run -d --name kong-gateway \
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
 kong:latest

curl -i -X GET --url http://localhost:8001/services
```

Kong Dashboard is at [http://localhost:8002](http://localhost:8002)

## Example: Create a service

```bash
# Create service
curl -i -s -X POST http://localhost:8001/services \
 --data name=example_service \
 --data url='https://www.htl-villach.at'

# Create route
curl -i -X POST http://localhost:8001/services/example_service/routes \
 --data 'paths[]=/mock' \
 --data name=example_route
```

Gateway now proxies service at [http://localhost:8000/mock](http://localhost:8000/mock)

## Stop Kong

```bash
podman kill kong-gateway
podman kill kong-database
podman container rm kong-gateway
podman container rm kong-database
podman network rm kong-net
```
