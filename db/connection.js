require('dotenv').config();
// Connect to database
const db = require('db')
db.connect({
  host: 'localhost',   
  name: process.env.DB_NAME,   
  username: process.env.DB_USER,
  password: process.env.DB_PASS
})
console.log('Connected to the tracker database.');

module.exports = db;
