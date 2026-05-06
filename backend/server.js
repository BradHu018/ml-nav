
// need this to read the .env file so we can use process.env
// need to load dotenv before db.js runs
require("dotenv").config();
console.log("DB_USER: ", process.env.DB_USER);
console.log("DB_NAME: ", process.env.DB_NAME);


const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// test if express can connect to MySQL 
const pool = require("./config/db");

// creates the server app 
const app = express();

app.use(cors());
app.use(express.json());


// creates an API route
app.get("/", (req, res) => {
  res.send("MLBB backend is running");
});

// another api route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend connected successfully",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// another api route
// when visiting http://localhost:5000/api/test-db express runs this function
// just tests if database is connected successfully
app.get("/api/test-db", async (req, res) => {
  try {
    // express asks MySQL to run SQL 
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    // sends result back to the browser 
    res.json({
      message: "Database connected successfully",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// signup route

app.post("/api/signup", async (req, res) => {
    try{
        console.log("REQ BODY: ", req.body);
        const {username, email, password} = req.body || {}; 

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "username, email, and password are required"
            });
        }

        const [existingUsers] = await pool.query(
            "Select id FROM users WHERE email = ? ",
            [email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            [username, email, passwordHash]
        );

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertId,
        });
    } catch (error) {
        console.error("Signup error: ", error);

        res.status(500).json({
            message: "Signup failed",
            error: error.message,
        })
    }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});