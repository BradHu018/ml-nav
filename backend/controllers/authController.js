// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role || "user",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email, and password are required",
      });
    }

    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    const newUser = {
      id: result.insertId,
      username,
      email,
      role: "user",
    };

    const token = createToken(newUser);

    return res.status(201).json({
      message: "Account created and logged in successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Server error during signup",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const loggedInUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || "user",
    };

    const token = createToken(loggedInUser);

    return res.json({
      message: "Login successful",
      token,
      user: loggedInUser,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
}

module.exports = {
  signup,
  login,
};