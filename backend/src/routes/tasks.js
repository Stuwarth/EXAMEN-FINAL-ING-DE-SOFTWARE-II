const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Actividad 4: Endpoints principales
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.patch('/:id/complete', taskController.completeTask);

module.exports = router;
