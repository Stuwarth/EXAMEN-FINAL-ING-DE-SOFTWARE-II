import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

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
      setError('El título de la tarea es obligatorio.');
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

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Taskify
        </div>
        <ul className="nav-menu">
          <li className="nav-item active">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Mi Tablero
          </li>
          <li className="nav-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4H5" />
            </svg>
            Completadas ({completedCount})
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="header-top">
          <h1 className="header-title">Planificador de Tareas</h1>
          <p className="header-subtitle">Actividad 4 - Gestiona las actividades de tu equipo</p>
        </div>

        <div className="grid-container">
          <div className="form-column">
            <div className="form-card">
              <h2 className="form-title">Registrar Nueva Tarea</h2>
              <form onSubmit={handleCreateTask}>
                <div className="input-wrapper">
                  <label className="input-label">Título de la Tarea</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Estudiar para el examen..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="input-wrapper">
                  <label className="input-label">Descripción Detallada (Opcional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Escribe los detalles aquí..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="error-badge">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" className="btn-primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Tarea
                </button>
              </form>
            </div>
          </div>

          <div className="list-column">
            <div className="task-header">
              <h2 className="form-title" style={{marginBottom: 0}}>Mis Tareas</h2>
              <span className="task-stats">{tasks.length} en total</span>
            </div>
            
            <div className="task-items">
              {tasks.length === 0 ? (
                <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-gray)', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-light)'}}>
                   Aún no tienes tareas registradas. Empieza creando una a la izquierda.
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    <button 
                      onClick={() => handleComplete(task.id)} 
                      className="task-status-btn"
                      title={task.completed ? "Completado" : "Marcar como completada"}
                    >
                      {task.completed && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                    <div className="task-info">
                      <div className="task-name">{task.title}</div>
                      {task.description && <div className="task-desc">{task.description}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
