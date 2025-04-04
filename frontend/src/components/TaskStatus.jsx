// src/components/TaskStatus.jsx
import { useEffect, useState } from "react"
import axios from "axios"

const TaskStatus = ({ taskId, onComplete }) => {
  const [status, setStatus] = useState("pending")

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/tasks/${taskId}`)
        setStatus(res.data.status)

        if (res.data.status === "completed") {
          clearInterval(interval)
          onComplete()  // notify parent
        }
      } catch (err) {
        console.error("Failed to fetch task status", err)
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [taskId, onComplete])

  return (
    <div className="mt-4 text-center">
      <span className="text-lg font-medium">
        Task Status:{" "}
        <span className={
          status === "completed" ? "text-green-600" :
          status === "in_progress" ? "text-yellow-600" :
          "text-gray-600"
        }>
          {status}
        </span>
      </span>
    </div>
  )
}

export default TaskStatus
