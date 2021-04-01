use yelpcamp_123
db.dummyCollection.insert({ prop:"value" })
db.getMongo().getDBNames()
use admin
db.createUser({ user: "username", pwd: "password", roles: [ { role: "readWrite", db: "yelpcamp_123" }, { role: "dbAdmin", db: "yelpcamp_123"} ]})
db.getUsers()