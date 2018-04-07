module.exports = {
  "development": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "",
    "port":3308,
    "database": "pet_match_db",
    "host": process.env.DB_HOST || "localhost",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "root",
    "port":3308,
    "database": "pet_match_db",
    "host": "localhost",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password":"root",
    "port":3308,
    "database": "pet_match_db",
    "host": "localhost",
    "dialect": "mysql"
  }
}
