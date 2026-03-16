import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import upload from "../middleware/upload.js";
import { sendOTPEmail, sendPasswordResetEmail } from "../utils/mailer.js";

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
      path: "/",
      maxAge: 24 * 60 * 60 * 1000
    });
  };


  router.post("/send-otp", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const existingUser = await db.get(
        "SELECT * FROM users WHERE email = ?", [email]
      );
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000;

      await db.run("DELETE FROM otp_verification WHERE email = ?", [email]);
      await db.run(
        "INSERT INTO otp_verification (email, otp, expires_at) VALUES (?, ?, ?)",
        [email, otp, expiresAt]
      );

      await sendOTPEmail(email, otp);
      res.json({ message: "OTP sent successfully" });

    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });


  router.post("/signup", async (req, res) => {
    try {
      const { name, email, password, otp } = req.body;

      if (!name || !email || !password || !otp) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const otpRecord = await db.get(
        "SELECT * FROM otp_verification WHERE email = ? ORDER BY id DESC LIMIT 1",
        [email]
      );

      if (!otpRecord) {
        return res.status(400).json({ error: "No OTP found. Please request a new one." });
      }

      if (Date.now() > otpRecord.expires_at) {
        await db.run("DELETE FROM otp_verification WHERE email = ?", [email]);
        return res.status(400).json({ error: "OTP expired. Please request a new one." });
      }

      if (otpRecord.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP. Please try again." });
      }

      const existingUser = await db.get(
        "SELECT * FROM users WHERE email = ?", [email]
      );
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

      await db.run("DELETE FROM otp_verification WHERE email = ?", [email]);

      const newUser = { id: result.lastID, name, email, avatar: null };
      setAuthCookie(res, newUser);
      res.status(201).json({ user: newUser });

    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Server error during signup" });
    }
  });


  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.get(
        "SELECT * FROM users WHERE email = ?", [email]
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
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ error: "Not logged in" });

      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const user = await db.get(
        "SELECT id, name, email, avatar FROM users WHERE id = ?",
        [decoded.id]
      );

      if (!user) return res.status(401).json({ error: "User not found" });

      res.json({ user });

    } catch (error) {
      console.error("Error in /me route:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const user = await db.get(
        "SELECT * FROM users WHERE email = ?", [email]
      );

   
      if (!user) {
        return res.json({ message: "If this email is registered, an OTP has been sent." });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000;

      await db.run("DELETE FROM otp_verification WHERE email = ?", [email]);
      await db.run(
        "INSERT INTO otp_verification (email, otp, expires_at) VALUES (?, ?, ?)",
        [email, otp, expiresAt]
      );

      await sendPasswordResetEmail(email, otp);
      res.json({ message: "If this email is registered, an OTP has been sent." });

    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to send reset OTP" });
    }
  });

 
  router.post("/verify-reset-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }

      const otpRecord = await db.get(
        "SELECT * FROM otp_verification WHERE email = ? ORDER BY id DESC LIMIT 1",
        [email]
      );

      if (!otpRecord) {
        return res.status(400).json({ error: "No OTP found. Please request a new one." });
      }

      if (Date.now() > otpRecord.expires_at) {
        await db.run("DELETE FROM otp_verification WHERE email = ?", [email]);
        return res.status(400).json({ error: "OTP expired. Please request a new one." });
      }

      if (otpRecord.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP. Please try again." });
      }

      res.json({ message: "OTP verified" });

    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

 
  router.post("/reset-password", async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }

      const otpRecord = await db.get(
        "SELECT * FROM otp_verification WHERE email = ? ORDER BY id DESC LIMIT 1",
        [email]
      );

      if (!otpRecord) {
        return res.status(400).json({ error: "No OTP found. Please request a new one." });
      }

      if (Date.now() > otpRecord.expires_at) {
        await db.run("DELETE FROM otp_verification WHERE email = ?", [email]);
        return res.status(400).json({ error: "OTP expired. Please request a new one." });
      }

      if (otpRecord.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP. Please try again." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.run(
        "UPDATE users SET password = ? WHERE email = ?",
        [hashedPassword, email]
      );

      await db.run("DELETE FROM otp_verification WHERE email = ?", [email]);
      res.json({ message: "Password reset successfully. Please login." });

    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });


  router.post("/change-name", async (req, res) => {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ error: "Not logged in" });

      const decoded = jwt.verify(token, JWT_SECRET);
      const { name } = req.body;

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: "Valid name required" });
      }

      await db.run("UPDATE users SET name = ? WHERE id = ?", [name, decoded.id]);
      res.json({ message: "Name updated successfully", name });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update name" });
    }
  });


  router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
    try {
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ error: "Not logged in" });

      const decoded = jwt.verify(token, JWT_SECRET);

      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const avatarPath = `/uploads/${req.file.filename}`;
      await db.run("UPDATE users SET avatar = ? WHERE id = ?", [avatarPath, decoded.id]);

      res.json({ message: "Avatar uploaded successfully", avatar: avatarPath });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Avatar upload failed" });
    }
  });


  router.post("/change-password", async (req, res) => {
    try {
      const token = req.cookies?.token;
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
      await db.run(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedNewPassword, decoded.id]
      );

      res.json({ message: "Password updated successfully!" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update password" });
    }
  });


  router.post("/logout", (req, res) => {
    res.clearCookie("token", { path: "/" });
    res.json({ message: "Logged out successfully" });
  });

  return router;
}