const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});
// /home/caio/northcoders/backend/be-nc-news/.env.news_database

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
}

module.exports = new Pool();
