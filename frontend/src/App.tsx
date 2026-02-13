import { Routes, Route } from "react-router-dom"
import TaskList from "./pages/TaskList"
import TaskForm from "./components/TaskForm"

function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskList />} />
      <Route path="/tasks/new" element={<TaskForm />} />
      <Route path="/tasks/:id/edit" element={<TaskForm />} />
    </Routes>
  )
}

export default App
