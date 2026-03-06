import express from "express";
import { connectDB } from "./database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();
const PORT = 5000;

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

let db;

(async () => {
  db = await connectDB();

  app.use("/api/auth", authRoutes(db));

  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
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
        `SELECT * FROM tasks 
        WHERE user_id = ? 
        AND due_date < DATE('now') 
        AND is_done = 0`,
        [user_id]
      );

    } else {

      tasks = await db.all(
        "SELECT * FROM tasks WHERE user_id = ?",
        [user_id]
      );

    }

    res.json(tasks);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Something went wrong" });

  }
});



app.post("/api/tasks", authMiddleware, async (req, res) => {
  try {

    const user_id = req.user.id;

    const { title, description, category, priority, due_date } = req.body;

    const result = await db.run(
      `INSERT INTO tasks
      (user_id,title,description,category,priority,due_date)
      VALUES(?,?,?,?,?,?)`,
      [user_id, title, description, category, priority, due_date]
    );

    res.status(201).json({
      id: result.lastID,
      title,
      description,
      category,
      priority,
      due_date,
      is_done: 0,
    });

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

    if (result.changes === 0) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (error) {

    console.error(error);
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

    if (result.changes === 0) {
      return res.status(404).json({ message: "Task Not Found!" });
    }

    res.json({ message: "Task Status Toggled Successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });

  }
});