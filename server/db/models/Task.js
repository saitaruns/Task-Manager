const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["todo", "progress", "review", "finished"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "Urgent"],
      default: "Low",
    },
    deadline: {
      type: String,
    },
    metadata: {
      type: Object,
      default: {},
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
