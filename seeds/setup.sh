#!/bin/bash
echo "HOST: $1"
echo "DATABASE: $2"
echo "ADMIN_USER: $3"
echo "ADMIN_PASS: $4"
echo "DB_USER: $5"
echo "DB_PASS: $6"

mongo --host $1 admin -u $3 -p $4 < ./mongo_shell.js

echo user created

mongoimport --host $1 --db $2 --authenticationDatabase admin --username $5 --password $6 --mode upsert --collection users --type json --file /users_data.json --jsonArray
mongoimport --host $1 --db $2 --authenticationDatabase admin --username $5 --password $6 --mode upsert --collection campgrounds --type json --file /campgrounds_data.json --jsonArray
mongoimport --host $1 --db $2 --authenticationDatabase admin --username $5 --password $6 --mode upsert --collection comments --type json --file /comments_data.json --jsonArray

echo data loaded successfully to mongodb://$5:$6@$1:27017/$2
