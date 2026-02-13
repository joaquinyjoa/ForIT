import { Routes, Route } from "react-router-dom"
import TaskList from "./pages/TaskList"
import TaskForm from "./components/TaskForm"

function App() {
  return (
    <Routes>
      <Route path="/" element={<TaskList />} />
      <Route path="/new" element={<TaskForm />} />
      <Route path="/edit/:id" element={<TaskForm />} />
    </Routes>
  )
}

export default App
