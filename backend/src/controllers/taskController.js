const TaskModel = require('../models/taskModel');

// Actividad 4: Implementación funcional (Validar vacíos, registrar, listar, completar)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.getAll();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validación: No se ingresen datos vacíos
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'El título de la tarea es obligatorio' });
    }

    const newTaskId = await TaskModel.create(title.trim(), description?.trim() || '');
    
    res.status(201).json({
      id: newTaskId,
      title: title.trim(),
      description: description?.trim() || '',
      completed: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await TaskModel.markCompleted(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea marcada como completada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al completar la tarea' });
  }
};
