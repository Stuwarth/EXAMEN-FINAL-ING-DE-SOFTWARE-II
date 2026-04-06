import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Cambiar URL si es necesario
  const API_URL = 'http://localhost:5000/api/tasks';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar tareas');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título de la tarea es obligatorio (Validación vacíos)');
      return;
    }
    
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/complete`, {
        method: 'PATCH',
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Gestión de Tareas</h1>
        <p>Actividad 4 - Examen Ing. de Software II</p>
      </div>

      <form onSubmit={handleCreateTask} className="task-form">
        <div className="input-group">
          <input
            type="text"
            className="task-input"
            placeholder="¿Qué necesitas hacer? (Título)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="input-group">
          <textarea
            className="task-textarea"
            placeholder="Detalles adicionales (opcional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <div style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>{error}</div>}
        <button type="submit" className="btn-submit">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar Tarea
        </button>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay tareas registradas aún. ¡Añade una!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.description && <div className="task-desc">{task.description}</div>}
              </div>
              <button 
                onClick={() => handleComplete(task.id)} 
                className={`btn-complete ${task.completed ? 'is-done' : ''}`}
                title={task.completed ? "Completado" : "Marcar como completada"}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
