// import mysql2
const mysql = require("mysql2");

// destructuring of process.env
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env

// set connection
const connection = mysql.createConnection({
  host: DB_HOST || "localhost",
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
})

// use connection
connection.connect((err) => {
  if (err) return console.log("Error while connecting to mySQL: " + err);
  else return console.log("Connected to mySQL");
})


module.exports = connection;