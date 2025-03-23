#!/usr/bin/bash

if ! curl -s http://localhost:8001 &> /dev/null
then
    echo "Kong is not reachable, exiting"
    exit 1
fi

curl -s http://localhost:8001/routes | jq -r '.data[].id' | xargs -I {} curl -X DELETE "http://localhost:8001/routes/{}"
curl -s http://localhost:8001/services | jq -r '.data[].id' | xargs -I {} curl -X DELETE "http://localhost:8001/services/{}"
curl -s http://localhost:8001/upstreams | jq -r '.data[].id' | xargs -I {} curl -X DELETE "http://localhost:8001/upstreams/{}"

PRODUCT_UPSTREAM_ID=$(curl -s -X POST http://localhost:8001/upstreams \
  --data "name=product-upstream" \
  --data "slots=10000" | jq -r '.id')

curl -s -X POST http://localhost:8001/upstreams/${PRODUCT_UPSTREAM_ID}/targets --data "target=product-service:8080" &> /dev/null
    
PRODUCT_SERVICE_ID=$(curl -s -X POST http://localhost:8001/services \
  --data "name=product-service" \
  --data "url=http://product-upstream" | jq -r '.id')

curl -s -X POST http://localhost:8001/services/${PRODUCT_SERVICE_ID}/routes \
  --data "paths[]=/api/products" \
  --data "name=product-route" \
  --data "strip_path=false" &> /dev/null

RATING_UPSTREAM_ID=$(curl -s -X POST http://localhost:8001/upstreams \
    --data "name=rating-upstream" \
    --data "slots=10000" | jq -r '.id')

curl -s -X POST http://localhost:8001/upstreams/${RATING_UPSTREAM_ID}/targets --data "target=rating-service:8080" &> /dev/null

RATING_SERVICE_ID=$(curl -s -X POST http://localhost:8001/services \
    --data "name=rating-service" \
    --data "url=http://rating-upstream" | jq -r '.id')

curl -s -X POST http://localhost:8001/services/${RATING_SERVICE_ID}/routes \
    --data "paths[]=~/api/products/\\d%2b/ratings" \
    --data "name=rating-route" \
    --data "strip_path=false" &> /dev/null

echo "API Gateway configured"




