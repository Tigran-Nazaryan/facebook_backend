import dbConfig from "./index.js";

const config = {
    "development": {
        "username": dbConfig.user,
        "password": dbConfig.password,
        "database": dbConfig.database,
        "host": dbConfig.host,
        "dialect": dbConfig.dialect,
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}

export default config;