# Online-Shop Backend

## Technical Overview

```plantuml

node "Node.Js" {
  interface HTTP
  [Express]
}

database "MongoDB" {
    [DB]
}

HTTP -right- [Express]
[Express] -right- DB
```

This backend is based on the following technologies:

*   MongoDB
*   Express
*   Node.js

## Getting started

### How to run

```shell
# create a new container for the mongo database
docker create --name mongo-prod -p 27017:27017 mongo

# start the container
docker start mongo-prod

# fill database with demo data
npm run fill-demo-data

# start the service
npm start

docker stop mongo-prod
# if no longer needed, remove mongo container 
# --> all data is lost
docker rm -f mongo-prod
```

## Data Model

```plantuml

class Product {
  id: ObjectId
  productId: String
  name: String
  price: Number
}

class Rating {
  id: ObjectId
  timestamp: Date 
  productId: String
  numStars: Number   
}

Rating "0..n" -left-> "1" Product : > productId

```
