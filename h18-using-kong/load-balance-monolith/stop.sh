#!/usr/bin/bash

if ! command -v podman &> /dev/null
then
    echo "Podman could not be found, trying to use Docker instead"
    alias podman=docker
fi

echo "Stopping API Gateway"

podman stop kong-database kong-gateway &> /dev/null
podman rm kong-database kong-gateway &> /dev/null

echo "Stopping services"

podman stop shop-be-1 shop-be-2 shop-db-lb &> /dev/null
podman rm shop-be-1 shop-be-2 shop-db-lb &> /dev/null

echo "Removing network"

podman network rm kong-net &> /dev/null

echo "Done"