const sqlite3 = require('sqlite3').verbose();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './sample.db'
});

class SQLite {
  name;
  db;
  constructor(dbname) {
    this.name = dbname;
  }
  getName() {
    return this.name
  }
}


module.exports = SQLite;