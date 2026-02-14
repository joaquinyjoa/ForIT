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

    // Variables para fechas
    let from = null;
    let to = null;

    // Aplicar filtros de búsqueda
    if(filters.search){
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
    }

    // Aplicar filtros de completado
    if (filters.completed !== undefined && filters.completed !== "all") {
        const completed = filters.completed === "true";
        result = result.filter(task => task.completed === completed);
    }

    // Aplicar filtros de fecha
    if (filters.fromDate) {
        from = new Date(filters.fromDate);
        if (isNaN(from.getTime())) {
            throw new Error("Fecha 'desde' inválida");
        }
    }

    if (filters.toDate) {
        to = new Date(filters.toDate);
        if (isNaN(to.getTime())) {
            throw new Error("Fecha 'hasta' inválida");
        }
        to.setHours(23, 59, 59, 999);
    }

    if (from && to && from > to) {
        throw new Error("La fecha 'desde' no puede ser mayor que la fecha 'hasta'");
    }

    //Aplicar filtros
    if (from) {
        result = result.filter(t => new Date(t.createdAt) >= from);
    }

    if (to) {
        result = result.filter(t => new Date(t.createdAt) <= to);
    }

    return result;
}

module.exports = { createTask, updateTask, deleteTask, getTaskById, getTasksWithFilters };