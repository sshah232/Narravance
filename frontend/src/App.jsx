import { useState } from 'react'
import TaskForm from './components/TaskForm'
import TaskStatus from './components/TaskStatus'
import Charts from './components/Charts'

function App() {
  const [task, setTask] = useState(null)
  const [taskComplete, setTaskComplete] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <TaskForm
          onTaskCreated={(newTask) => {
            setTask(newTask)
            setTaskComplete(false)
          }}
        />
    
        {task && !taskComplete && (
          <TaskStatus
            taskId={task.id}
            onComplete={() => setTaskComplete(true)}
          />
        )}
      </div>
    
      <div className="md:col-span-2">
        {taskComplete && (
          <>
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded text-center font-medium">
              🎉 Task Completed! Here's your data analytics:
            </div>
            <Charts taskId={task.id} />
          </>
        )}
      </div>
    </div>
    </div>
  )
}

export default App
