import { Routes, Route } from "react-router-dom"
import TaskList from "./pages/TaskList"
import TaskForm from "./components/TaskForm"

function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskList />} />
      <Route path="/new" element={<TaskForm />} />
      <Route path="/:id/edit" element={<TaskForm />} />
    </Routes>
  )
}

export default App
