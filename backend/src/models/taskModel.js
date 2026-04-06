const db = require('../config/db');

// Actividad 3 y 4: Funciones pequeñas y con nombres claros
class TaskModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return rows;
  }

  static async create(title, description = '') {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description]
    );
    return result.insertId;
  }

  static async markCompleted(id) {
    const [result] = await db.query(
      'UPDATE tasks SET completed = TRUE WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = TaskModel;
