import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

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
        setIsFormVisible(false); // Hide form after creating
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/complete`, { method: 'PATCH' });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    // Para entornos web y agentes, eliminamos el confirm nativo para evitar bloqueos
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
      else alert("Error del servidor: O la tarea no existe o debes reiniciar Node.js (index.js)");
    } catch (err) {
      console.error(err);
      alert("Error de conexión al servidor");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription })
      });
      if (res.ok) {
        setEditingId(null);
        fetchTasks();
      } else alert("Error al guardar: reinicia tu Node.js");
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-left">
          <svg className="menu-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <h1 className="header-title">Task List</h1>
        </div>
        <button className="add-btn" onClick={() => setIsFormVisible(!isFormVisible)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New
        </button>
      </div>

      {isFormVisible && (
        <div className="form-container">
          <h2 className="form-title">Nueva Tarea</h2>
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Estudiar React..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="form-textarea"
              placeholder="Detalles (opcional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error && <div style={{ color: 'var(--danger)', marginBottom: '0.8rem', fontSize: '0.85rem' }}>{error}</div>}
            <button type="submit" className="btn-submit">Añadir Tarea</button>
          </form>
        </div>
      )}

      <div className="tasks-container">
        <div className="timeline-line"></div>
        
        {tasks.map((task) => (
          <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
            
            <div className="task-content-wrap">
              <div style={{cursor: 'pointer'}} onClick={() => handleComplete(task.id)}>
                {task.completed ? (
                  <div className="task-completed-check">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                ) : (
                  <div className="task-progress">
                    <div className="task-progress-inner">T</div>
                  </div>
                )}
              </div>

              <div className="task-text">
                {editingId === task.id ? (
                  <div style={{width: '100%'}}>
                    <input className="form-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <textarea className="form-textarea" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={{minHeight: '60px'}} />
                    <div className="edit-actions">
                      <button className="action-btn-wide btn-save" onClick={() => saveEdit(task.id)}>Guardar</button>
                      <button className="action-btn-wide btn-cancel" onClick={() => setEditingId(null)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-title" onClick={() => handleComplete(task.id)} style={{cursor: 'pointer'}}>{task.title}</div>
                    <div className="task-desc">{task.description || "Sin descripción adicional. Tarea pendiente por resolver."}</div>
                  </>
                )}
              </div>
            </div>

            {!editingId || editingId !== task.id ? (
              <div className="task-actions">
                <button className="action-btn btn-delete" onClick={() => handleDelete(task.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
                
                <button className="action-btn btn-edit" onClick={() => startEdit(task)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
            ) : null}

          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
