const express = require("express");
const router = express.Router();
const Task = require("../db/models/Task");
const authMiddleware = require("../middleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ author: req.user._id });
    if (!tasks) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      author: req.user._id,
    });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        author: req.user._id,
      },
      req.body,
      {
        lean: true,
        new: true,
      }
    );
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
