const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs"); // Using bcryptjs instead of bcrypt
const port = 5000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  database: "user_database",
  user: "root",
  password: "",
});
connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Database connected!!!!");
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Register.html"));
});

app.post("/submit", (req, res) => {
  const { fname, lname, email, password } = req.body;

  // Hashing password using bcryptjs
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error("Error generating salt:", err);
      res.status(500).send({
        status: 0,
        message: "Error hashing password",
      });
      return;
    }
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        res.status(500).send({
          status: 0,
          message: "Error hashing password",
        });
        return;
      }

      const existDataQuery = "SELECT * FROM users WHERE email = ?";
      connection.query(existDataQuery, [email], (err, data) => {
        if (err) {
          console.error("Error occurred during email check", err);
          res.status(500).send({
            status: 0,
            message: "Error checking email",
          });
          return;
        }

        if (data.length > 0) {
          res.send({
            status: 2,
            message: "Email already exists",
          });
        } else {
          const sql =
            "INSERT INTO users (fname, lname, email, password) VALUES (?, ?, ?, ?)";
          connection.query(
            sql,
            [fname, lname, email, hashedPassword],
            (err, result) => {
              if (err) {
                console.error("Error inserting data", err);
                res.send({
                  status: 0,
                  message: "Error occurred while adding the data",
                  data: err,
                });
                return;
              }
              res.send({
                status: 1,
                message: "User data inserted successfully",
              });
            }
          );
        }
      });
    });
  });
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const userQuery = "SELECT email, password FROM users WHERE email = ?";
  connection.query(userQuery, [email], (err, data) => {
    if (err) {
      return res.status(500).send({
        status: 0,
        message: "Error checking email",
      });
    }

    if (data.length === 0) {
      res.status(404).send({
        status: 0,
        message: "Email doesn't exist",
      });
      return false;
    }
    const hashedPassword = data[0].password;
    bcrypt.compare(password, hashedPassword, (err, result) => {
      console.log(result);
      if (err) {
        return res.status(500).send({
          status: 0,
          message: "Error comparing passwords",
        });
      }

      if (result) {
        return res.send({
          status: 1,
          message: "Login successful",
        });
      } else {
        return res.status(401).send({
          status: 0,
          message: "Password doesn't match",
        });
      }
    });
  });
});
app.get("/getData", (req, res) => {
  const retriveData = "SELECT * FROM users";
  connection.query(retriveData, (err, result) => {
    if (err) {
      console.error("Error retrieving data:", err);
      return res.status(500).send({
        status: 1,
        message: "Error retrieving data from the database",
        error: err,
      });
    }
    if (result.length === 0) {
      return res.status(404).send({
        status: 2,
        message: "No data found",
      });
    }
    return res.send({
      status: 0,
      message: "Data retrieved successfully",
      data: result,
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
