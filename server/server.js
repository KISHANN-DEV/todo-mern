require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todo = require("./models/todo");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB error:", err));


// CREATE
app.post("/api/todos", async (req, res) => {
    try {
        const { title } = req.body;

        const newTodo = new todo({ title });
        const savedTodo = await newTodo.save();

        res.json(savedTodo);
    } catch (error) {
        res.status(500).json({ message: "Error Creating Todo" });
    }
});


// READ
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: "Error Fetching todos" });
    }
});


// DELETE
app.delete("/api/todos/:id", async (req, res) => {
    try {
        await todo.findByIdAndDelete(req.params.id);
        res.json({ message: "Todo deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error Deleting Todo" });
    }
});


// UPDATE
app.put("/api/todos/:id", async (req, res) => {
    try {
        const { completed } = req.body;

        const updatedTodo = await todo.findByIdAndUpdate(
            req.params.id,
            { completed },
            { new: true }
        );

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: "Error Updating Todo" });
    }
});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});
