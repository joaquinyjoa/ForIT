let task = [];
let currentId = 1;

const getTaskById = (id) => {
    return new Promise((resolve, reject) => {
        const foundTask = task.find(t => t.id === parseInt(id));
        resolve(foundTask);
    });
}

const createTask = (title, description) => {
    return new Promise((resolve) => {
        const newTask = { id: currentId++, title, description, completed: false, createdAt: new Date() };
        task.push(newTask);
        resolve(newTask);
    });
}

const updateTask = (id, title, description, completed) => {
    return new Promise((resolve, reject) => {
        const index = task.findIndex(t => t.id === parseInt(id));
        if (index === -1) {
            reject(new Error('Tarea no encontrada'));
        }
        task[index] = { ...task[index], title, description, completed };
        resolve(task[index]);
    }
    );
}

const deleteTask = (id) => {
    return new Promise((resolve, reject) => {
        const index = task.findIndex(t => t.id === parseInt(id));
        if (index === -1) {
            reject(new Error('Tarea no encontrada'));
        }
        const deletedTask = task.splice(index, 1);
        resolve(deletedTask[0]);
    });
}

const getTasksWithFilters = (filters = {}) => {
    let result = [...task];

    if(filters.search){
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
    }

    if (filters.completed !== undefined && filters.completed !== "all") {
        const completed = filters.completed === "true";
        result = result.filter(task => task.completed === completed);
    }

    if (filters.fromDate && filters.toDate) {
        const fromDate = new Date(filters.fromDate);
        const toDate = new Date(filters.toDate);
        result = result.filter(task => {
            const createdAt = new Date(task.createdAt);
            return createdAt >= fromDate && createdAt <= toDate;
        });
    } else if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);
        result = result.filter(task => {
            const createdAt = new Date(task.createdAt);
            return createdAt >= fromDate;
        });
    } else if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        result = result.filter(task => {
            const createdAt = new Date(task.createdAt);
            return createdAt <= toDate;
        });
    }

    return result;
}

module.exports = { createTask, updateTask, deleteTask, getTaskById, getTasksWithFilters };