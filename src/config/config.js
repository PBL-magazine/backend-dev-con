require("dotenv").config();

const development = {
  username: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "api_server",
  host: "127.0.0.1",
  dialect: "mysql",
};

module.exports = { development };
