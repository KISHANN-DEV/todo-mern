require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/temp");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// CREATE
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

// READ
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Todos" });
  }
});

// DELETE
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Todo" });
  }
});

// UPDATE (Toggle Complete)
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});