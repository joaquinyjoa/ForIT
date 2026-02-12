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

        // Validar que title y description sean cadenas de texto
        if (typeof title !== 'string' || typeof description !== 'string') {
            return { valid: false, message: 'Title y description debe ser una cadena de texto' };
        }

        // Validar que title y description no estén vacíos
        if (!title || !description) {
            return { valid: false, message: 'Title y description es requerido' };
        }

        // Validar que title y description no estén compuestos solo por espacios
        if (title.trim() === '' || description.trim() === '') {
            return { valid: false, message: 'Title y Description no puede estar vacío' };
        }

        // Validar que title y description no excedan cierta longitud (por ejemplo, 255 caracteres)
        if (description.length > 255) {
            return { valid: false, message: 'Title y description no pueden exceder 255 caracteres' };
        }
        else if (title.length > 200) {
            return { valid: false, message: 'Title no puede exceder 200 caracteres' };
        }

        return { valid: true };
    }

    static validarTaskCompletionInput(completed) {
        // Validar que completed sea un valor booleano
        if (typeof completed !== 'boolean') {
            return { valid: false, message: 'Completed debe ser un valor booleano' };
        }

        return { valid: true };
    }

}



module.exports = TaskController;