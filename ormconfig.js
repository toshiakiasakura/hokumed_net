module.exports = {
   "type": "sqlite",
   "database": "db/test.sqlite",
   "synchronize": true, 
    // CONSTRAINT ERROR: https://github.com/typeorm/typeorm/issues/2576
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
