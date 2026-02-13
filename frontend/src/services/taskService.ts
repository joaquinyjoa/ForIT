const API = import.meta.env.VITE_API_URL;

export const getTasks = async () => {
  const response = await fetch(`${API}/tasks`);
  return response.json();
}

export const createTask = async (task) => {
    const response = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    return response.json();
}

export const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, {
        method: 'DELETE'
    });
}

export const updateTask = async (id, task) => {
    const response = await fetch(`${API}/tasks/${id}`, {
        method: 'PUT',  
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    return response.json();
}