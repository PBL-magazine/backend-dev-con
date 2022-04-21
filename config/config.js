require("dotenv").config();

const production = {
  username: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "api_server",
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
};

const development = {
  username: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "api_server",
  host: "127.0.0.1",
  dialect: "mysql",
};

const test = {
  username: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "api_server_test",
  host: "127.0.0.1",
  dialect: "mysql",
};

module.exports = { development, production, test };
