import React, { useEffect, useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Typed from "typed.js";
import { useTaskStore } from "../store/useTaskStore.js"; // Import Zustand task store

const Tasks = () => {
  const [todo, setTodo] = useState("");
  const [showFinished, setShowFinished] = useState(true);
  const typedElement = useRef(null);

  // Zustand store actions & state
  const { tasks, fetchTasks, addTask, editTask, deleteTask, toggleTaskCompletion, isLoading } =
    useTaskStore();  //functions imported from useTaskStore

  // Fetch tasks from API on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Typed.js animation
  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: [
        "Taskify – Stay on Track, Stay on Top.",
        "Taskify – Your Task Organizer!",
      ],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  // Handle adding a new task
  const handleAdd = async () => {
    if (todo.length > 3) {
      await addTask({ todo, isCompleted: false }); //todo name and isCompleted status is added to the tasks table
      setTodo(""); // Clear input after adding
    }     //add tasks is imported from useTaskStore
    fetchTasks()
  };

  // Handle editing a task
  const handleEdit = (id) => {
    const taskToEdit = tasks.find((task) => task._id === id);
    setTodo(taskToEdit.todo);
    handleDelete(id) // Remove existing task for edit from tasks table temporarily
    fetchTasks()
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks()
  };


  // Handle checkbox toggle
  const handleCheckbox = async (id) => {  
    await toggleTaskCompletion(id);   //toggleTask is for changing the status of the task from completed to not completed
    fetchTasks()
  };

  return (
    <>
      <div className="container mx-auto my-5 rounded-xl p-5 bg-blue-200 min-h-[85vh] w-full md:w-3/4 lg:w-1/2">
        <h1 className="font-bold text-center text-3xl">
          <span ref={typedElement}></span> {/* Typed.js effect */}
        </h1>
        <div className="addTodo my-6 flex flex-col gap-3">
          <h2 className="text-xl font-bold">Add a Task</h2>
          <div className="flex">
            <input
              onChange={(e) => setTodo(e.target.value)}
              value={todo}
              type="text"
              className="w-full rounded-lg px-5 py-1"
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3 || isLoading}
              className="bg-blue-800 hover:bg-blue-950 disabled:bg-blue-750 p-4 py-2 text-sm font-bold text-white rounded-md mx-2"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
        <input
          className="my-4"
          onChange={() => setShowFinished(!showFinished)}
          type="checkbox"
          checked={showFinished}
        />
        <p>Show Finished</p>
        </div>
        
        <hr />

        <h2 className="text-xl font-bold">Your Tasks</h2>

        <div className="todos">
          {tasks.length === 0 && <div className="m-5">No Tasks to display</div>}

          {tasks.map((item) => (
            (showFinished || !item.isCompleted) && (
              <div key={item._id} className="todo flex flex-wrap my-3 justify-between">
                <div className="flex gap-5">
                  <input
                    name={item._id}
                    onChange={() => handleCheckbox(item._id)}
                    type="checkbox"
                    checked={item.isCompleted}
                  />
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                </div>
                <div className="buttons flex h-full">
                  <button
                    onClick={() => handleEdit(item._id)}
                    className="bg-blue-800 hover:bg-blue-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-blue-800 hover:bg-blue-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
};

export default Tasks;
