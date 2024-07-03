require('dotenv').config(); // this is important!
module.exports = {
    "development": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_DATABASE,
        "host": process.env.DB_HOST,
        "dialect": "mysql"
      },
      "test": {
        "username": "gians_walt_24",
        "password": "Project#PA-24",
        "database": "db_pa_2024",
        "host": "db4free.net",
        "dialect": "mysql"
      },
      "production": {
        "username": "gians_walt_24",
        "password": "Project#PA-24",
        "database": "db_pa_2024",
        "host": "db4free.net",
        "dialect": "mysql"
      }
};