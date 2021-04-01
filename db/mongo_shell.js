use yelpcamp_123
db.dummyCollction.insert({prop:"value"})
db.getMongo().getDBNames()
db.createUser({ user: "username", pwd: "password", roles: [ { role: "readWrite", db: "reporting" } ], mechanisms: [ "SCRAM-SHA-1" ] })
db.getUsers()