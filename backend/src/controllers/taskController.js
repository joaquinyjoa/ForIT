const taskModel = require('../models/taskmodel');

class TaskController {
    static  getTasksController = async (req, res) => {
        try {
            const tasks = await taskModel.getTasks();

            if (!tasks || tasks.length === 0) {
                return res.status(404).json({ error: 'No se encontraron tareas' });
            }

            return res.status(200).json(tasks);
            
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener tareas' });
        }
    }

    static createTaskController = async (req, res) => {
        // Validar entrada
        const { title, description } = req.body;

        // Validar que title y description no estén vacíos
        const validation = this.validarTaskInput(title, description);

        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        try {
            const newTask = await taskModel.createTask(title, description);
            return res.status(201).json(newTask);
        } catch (error) {
            return res.status(500).json({ error: 'Error al crear tarea' });
        }
    }

    static getTaskByIdController = async (req, res) => {
        const { id } = req.params;
        try {
            const task = await taskModel.getTaskById(id);

            if (!task) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }

            return res.status(200).json(task);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static  updateTaskController = async (req, res) => {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        // Validar entrada
        const validation = this.validarTaskInput(title, description);
        const completionValidation = this.validarTaskCompletionInput(completed);

        if (!completionValidation.valid) {
            return res.status(400).json({ error: completionValidation.message });
        }

        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        try {
            const updatedTask = await taskModel.updateTask(id, title, description, completed);
            return res.status(200).json(updatedTask);
        } catch (error) {
            return res.status(500).json({ error: 'Error al actualizar tarea' });
        }
    }

    static deleteTaskController = async (req, res) => {
        const { id } = req.params;

        try {
            const result = await taskModel.deleteTask(id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'Error al eliminar tarea' });
        }
    }

       static validarTaskInput(title, description) {

        title = String(title);
        description = String(description);
// Validar que title y description no estén vacíos
        if (title.trim() === '' || description.trim() === '') {
            return { valid: false, message: 'Title y Description no puede estar vacío' };
        }
        // Validar longitud de title y description
        if (description.length > 255) {
            return { valid: false, message: 'Description no puede exceder 255 caracteres' };
        }
        // Validar longitud de title
        if (title.length > 200) {
            return { valid: false, message: 'Title no puede exceder 200 caracteres' };
        }

        return { valid: true };
    }

    static validarTaskCompletionInput(completed) {
        // Validar que completed sea un valor booleano
        if (
            typeof completed !== 'boolean' &&
            completed !== 0 &&
            completed !== 1
        ) {
            return { valid: false, message: 'Completed debe ser boolean o 0/1' };
        }

        return { valid: true };
    }

}


module.exports = TaskController;