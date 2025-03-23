#!/usr/bin/bash

if ! command -v podman &> /dev/null
then
    echo "Podman could not be found, trying to use Docker instead"
    alias podman=docker
fi

echo "Stopping API Gateway"

podman stop kong-database kong &> /dev/null
podman rm kong-database kong &> /dev/null

echo "Stopping services"

podman stop product-service rating-service product-db rating-db &> /dev/null
podman rm product-service rating-service product-db rating-db &> /dev/null

echo "Removing network"

podman network rm wmcnet &> /dev/null
