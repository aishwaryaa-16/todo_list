import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useTaskStore = create((set, get) => ({
  tasks: [],  
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/tasks/getTasks");  //FETCH THE API FROM THE BACKEND USING AXIOS AND DISPLAY THE RESULT/TASKS IN THE FRONTEND
      set({ tasks: res.data.tasks });                          //DISPLAY, ADD, DELETE, EDIT THE TASKS IN THE FRONTEND
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (task) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/tasks/addTask", task);
      set({ tasks: [...get().tasks, res.data.task] });
      toast.success("Task added successfully");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    } finally {
      set({ isLoading: false });
    }
  },

  editTask: async (taskId, updatedTask) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put(`/tasks/${taskId}`, updatedTask);
      set({
        tasks: get().tasks.map((task) => (task.id === taskId ? res.data.task : task)),
      });
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error editing task:", error);
      toast.error("Failed to edit task");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (taskId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      set({ tasks: get().tasks.filter((task) => task.id !== taskId) });
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      set({ isLoading: false });
    }
  },

  toggleTaskCompletion: async (taskId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/tasks/${taskId}`);
      set({
        tasks: get().tasks.map((task) =>
          task.id === taskId ? res.data.task : task
        ),
      });
      toast.success("Task status updated");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to update task status");
    } finally {
      set({ isLoading: false });
    }
  },
}));
