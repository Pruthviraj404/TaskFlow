import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
const JWT_SECRET = "mysecretkey";

export default function (db) {


  router.post("/signup", async (req, res) => {
    try {

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingUser = await db.get(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.run(
        "INSERT INTO users (name,email,password) VALUES (?,?,?)",
        [name, email, hashedPassword]
      );

      res.status(201).json({
        id: result.lastID,
        name,
        email,
      });

    } catch (error) {

      console.error(error);
      res.status(500).json({ error: "Server error" });

    }
  });




  router.post("/login", async (req, res) => {
    try {

      const { email, password } = req.body;

      const user = await db.get(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });

    } catch (error) {

      console.error(error);
      res.status(500).json({ error: "Server error" });

    }
  });



  

  router.post("/logout", (req, res) => {

    res.clearCookie("token");

    res.json({ message: "Logged out successfully" });

  });



  return router;
}