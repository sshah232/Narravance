// src/components/TaskForm.jsx
import { useState } from "react"
import axios from "axios"

const TaskForm = ({ onTaskCreated }) => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [makes, setMakes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post("http://127.0.0.1:8000/tasks/", {
        start_date: startDate,
        end_date: endDate,
        makes: makes.split(",").map((make) => make.trim()),
      })
      onTaskCreated(response.data)
    } catch (err) {
      console.error("Error creating task", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Data Task</h2>
      <div className="mb-4">
        <label className="block font-medium">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 p-2 w-full border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 p-2 w-full border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Car Makes (comma separated)</label>
        <input
          type="text"
          value={makes}
          onChange={(e) => setMakes(e.target.value)}
          placeholder="Honda, Toyota"
          className="mt-1 p-2 w-full border rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  )
}

export default TaskForm
