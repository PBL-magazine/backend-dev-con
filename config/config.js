require("dotenv").config();

const development = {
  username: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "api_server",
  host: "127.0.0.1",
  dialect: "mysql",
};

const production = {
  username: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "api_server",
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
};

module.exports = { development, production };
