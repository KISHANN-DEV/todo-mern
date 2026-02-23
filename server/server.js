require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/todo");

const app = express();

/* ================= CORS CONFIG ================= */
// Allow frontend from anywhere (safe for small projects)
// You can later restrict to your Vercel domain
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/* ================= ROOT ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ================= MONGODB CONNECTION ================= */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
    process.exit(1);
  });

/* ================= CREATE ================= */
app.post("/api/todos", async (req, res) => {
  try {
    const { title } = req.body;

    const newTodo = new Todo({ title });
    const savedTodo = await newTodo.save();

    res.json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error Creating Todo" });
  }
});

/* ================= READ ================= */
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Todos" });
  }
});

/* ================= DELETE ================= */
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Todo" });
  }
});

/* ================= UPDATE ================= */
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error Updating Todo" });
  }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});