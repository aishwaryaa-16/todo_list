import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(  //task table has multiple fields LIKE TODO, ISCOMPLETED, USERID
  {
    todo: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
