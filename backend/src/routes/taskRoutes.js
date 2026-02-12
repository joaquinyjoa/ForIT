const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

router.get("/", TaskController.getTasksController);
router.post("/", TaskController.createTaskController);
router.put("/:id", TaskController.updateTaskController);
router.delete("/:id", TaskController.deleteTaskController);

module.exports = router;