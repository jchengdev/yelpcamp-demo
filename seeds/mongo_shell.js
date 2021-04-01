use yelpcamp_123
db.dummyCollction.insert({ prop:"value" })
db.getMongo().getDBNames()
db.createUser({ user: "username", pwd: "password", roles: [ "readWrite", "dbAdmin" ]})
db.getUsers()