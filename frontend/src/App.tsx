import { Routes, Route } from "react-router-dom";
import TaskList from "./pages/TaskList";
import TaskForm from "./components/TaskForm";

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Task Manager</h1>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/add" element={<TaskForm />} />
        <Route path="/edit/:id" element={<TaskForm />} />
      </Routes>
    </div>
  );
}

export default App;