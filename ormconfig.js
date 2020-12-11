module.exports = {
   "type": "sqlite",
   "database": "db/test.sqlite",
   "synchronize": true,
   "logging": false,
   "entities": [
      __dirname + "/dist/api/entity/**/*.js"
   ],
   "migrations": [
      __dirname + "/dist/api/migration/**/*.js"
   ],
   "subscribers": [
      __dirname + "/dist/api/subscriber/**/*.js"
   ],
   "cli": {
      "entitiesDir": "/api/entity",
      "migrationsDir": "/api/migration",
      "subscribersDir": "/api/subscriber"
   }
}
