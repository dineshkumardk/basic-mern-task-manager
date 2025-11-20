// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' })

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks')
    setTasks(res.data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return alert('Title required');
    await axios.post('http://localhost:5000/api/tasks', form);
    setForm({ title: '', description: '' });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title}
               onChange={e => setForm({...form, title: e.target.value})} />
        <input placeholder="Description" value={form.description}
               onChange={e => setForm({...form, description: e.target.value})} />
        <button>Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <b>{task.title}</b>: {task.description}
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
