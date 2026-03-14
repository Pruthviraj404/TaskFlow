import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import upload from "../middleware/upload.js";

const router = express.Router();
const JWT_SECRET = "mysecretkey";

export default function (db) {

  const setAuthCookie = (res, user) => {
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
  };


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

      const newUser = {
        id: result.lastID,
        name,
        email,
        avatar: null
      };

      setAuthCookie(res, newUser);

      res.status(201).json({ user: newUser });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during signup" });
    }
  });


  router.post("/login", async (req, res) => {
    try {

      const { email, password } = req.body;

      const user = await db.get(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      setAuthCookie(res, user);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error during login" });
    }
  });


  router.get("/me", async (req, res) => {
    try {

      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ error: "Not logged in" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await db.get(
        "SELECT id,name,email,avatar FROM users WHERE id = ?",
        [decoded.id]
      );

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      res.json({ user });

    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  
  router.post("/change-name", async (req, res) => {
    try {

      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ error: "Not logged in" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      const { name } = req.body;

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: "Valid name required" });
      }

      await db.run(
        "UPDATE users SET name = ? WHERE id = ?",
        [name, decoded.id]
      );

      res.json({
        message: "Name updated successfully",
        name
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update name" });
    }
  });

 
  router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
    try {

      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ error: "Not logged in" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const avatarPath = `/uploads/${req.file.filename}`;

      await db.run(
        "UPDATE users SET avatar = ? WHERE id = ?",
        [avatarPath, decoded.id]
      );

      res.json({
        message: "Avatar uploaded successfully",
        avatar: avatarPath
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Avatar upload failed" });
    }
  });
  router.post("/change-password", async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Not logged in" });

      const decoded = jwt.verify(token, JWT_SECRET);
      const { currentPassword, newPassword } = req.body;

  
      const user = await db.get("SELECT * FROM users WHERE id = ?", [decoded.id]);
      if (!user) return res.status(404).json({ error: "User not found" });

    
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

     
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // 4. DB update karo
      await db.run("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, decoded.id]);

      res.json({ message: "Password updated successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update password" });
    }
  });


  router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  });

  return router;
}