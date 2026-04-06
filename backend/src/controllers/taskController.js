const TaskModel = require('../models/taskModel');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.getAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const newTaskId = await TaskModel.create(title.trim(), description?.trim() || '');
    res.status(201).json({ id: newTaskId, title: title.trim(), description: description?.trim() || '', completed: false });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const success = await TaskModel.markCompleted(req.params.id);
    if (!success) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Estado de la tarea actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const success = await TaskModel.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const success = await TaskModel.update(req.params.id, title.trim(), description?.trim() || '');
    if (!success) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};
