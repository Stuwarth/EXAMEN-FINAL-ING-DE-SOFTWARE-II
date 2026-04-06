const db = require('../config/db');

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
      'UPDATE tasks SET completed = NOT completed WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async update(id, title, description) {
    const [result] = await db.query(
      'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = TaskModel;
