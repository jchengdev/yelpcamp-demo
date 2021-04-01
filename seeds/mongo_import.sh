#!/bin/bash
echo "HOST: $1"
echo "DATABASE: $2"
echo "USERNAME: $3"
echo "PASSWORD: $4"

mongoimport --host $1 --db $2 --username $3 --password $4 --mode upsert --collection users --type json --file /users_data.json --jsonArray
mongoimport --host $1 --db $2 --username $3 --password $4 --mode upsert --collection campgrounds --type json --file /campgrounds_data.json --jsonArray
mongoimport --host $1 --db $2 --username $3 --password $4 --mode upsert --collection comments --type json --file /comments_data.json --jsonArray

echo mongodb://$3:$4@$1:27017/$2 loaded successfully
