# How to run

```bash
docker compose build && docker compose up
```

or:

```bash
docker build -t products-service:latest ./products
docker build -t ratings-service:latest ./ratings

docker network create -d bridge wmcnet

docker run --name productsdb --network wmcnet -p 5001:27017 -d mongo
docker run --name ratingsdb --network wmcnet -p 6001:27017 -d mongo

docker run --name products-service --network wmcnet -p 5000:5000 -e MONGODB_CONNECTION_STRING=mongodb://productsdb:27017/online-shop-products -e PORT=5000 -d products-service:latest

docker run --name ratings-service --network wmcnet -p 5000:5000 -e MONGODB_CONNECTION_STRING=mongodb://ratingsdb:27017/online-shop-ratings -e PORT=6000 -d products-service:latest
```
