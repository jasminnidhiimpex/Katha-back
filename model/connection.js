const mysql = require("mysql2");
require('dotenv').config();
 
// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
});
 
// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});
 
// Export the db object
module.exports = db;