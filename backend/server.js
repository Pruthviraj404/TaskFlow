
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import { authMiddleware } from "./middleware/auth.js";
import { startReminderScheduler } from "./utils/reminderScheduler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

let db;

(async () => {
  try {
    db = await connectDB();
    console.log("Database Connected!");
    app.use("/api/auth", authRoutes(db));

    
    startReminderScheduler(db);

    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB:", err);
  }
})();

app.get("/", (req, res) => {
  res.send("Task Flow is Running!");
});


app.get("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { status } = req.query;
    let tasks;

    if (status === "overdue") {
      tasks = await db.all(
        `SELECT * FROM tasks WHERE user_id = ? AND due_date < DATE('now') AND is_done = 0`,
        [user_id]
      );
    } else {
      tasks = await db.all("SELECT * FROM tasks WHERE user_id = ?", [user_id]);
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.post("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { title, description, category, priority, due_date, due_time } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const result = await db.run(
      `INSERT INTO tasks (user_id, title, description, category, priority, due_date, due_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, title, description || null, category, priority, due_date, due_time || null]
    );

    res.status(201).json({
      id: result.lastID,
      user_id,
      title,
      description: description || null,
      category,
      priority,
      due_date,
      due_time: due_time || null,
      is_done: 0
    });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const id = req.params.id;
    const { title, description, category, priority, due_date, due_time } = req.body;

    const result = await db.run(
      `UPDATE tasks SET title=?, description=?, category=?, priority=?, due_date=?, due_time=? WHERE id=? AND user_id=?`,
      [title, description, category, priority, due_date, due_time, id, user_id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ id: Number(id), title, description, category, priority, due_date, due_time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const id = req.params.id;
    const result = await db.run(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    if (result.changes === 0) return res.status(404).json({ message: "Task Not Found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.patch("/api/tasks/:id/done", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const id = req.params.id;
    const result = await db.run(
      "UPDATE tasks SET is_done = NOT is_done WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
    if (result.changes === 0) return res.status(404).json({ message: "Task Not Found!" });
    res.json({ message: "Task Status Toggled Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});
