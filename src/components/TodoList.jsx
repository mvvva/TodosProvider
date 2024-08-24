import React, { useEffect } from 'react';
import AddTodo from './AddTodo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTodos } from './TodosProvider';

function TodoList() {
  const { state, dispatch } = useTodos();
  const { tasks, editId, editValue, loading, doneCount } = state;

  useEffect(() => {
    fetch('https://posts-server-94oo.onrender.com/posts')
      .then(response => response.json())
      .then(data => {
        dispatch({ type: 'SET_TASKS', payload: data });
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, [dispatch]);

  const handleAddTask = (taskTitle) => {
    dispatch({ type: 'TOGGLE_LOADING', payload: 'Adding...' });
    const id = tasks.length ? String(Number(tasks[tasks.length - 1].id) + 1) : '1';
    const newTask = { id, title: taskTitle, body: taskTitle, datetime: new Date().toLocaleString(), isChecked: false };

    fetch('https://posts-server-94oo.onrender.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
      .then(response => response.json())
      .then(newTask => {
        dispatch({ type: 'ADD_TASK', payload: newTask });
      })
      .catch(error => {
        console.error('Error adding task:', error);
        dispatch({ type: 'TOGGLE_LOADING', payload: '' });
      });
  };

  const handleDeleteTask = (id) => {
    dispatch({ type: 'TOGGLE_LOADING', payload: 'Deleting...' });
    fetch(`https://posts-server-94oo.onrender.com/posts/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        dispatch({ type: 'DELETE_TASK', payload: id });
      })
      .catch(error => {
        console.error('Error deleting task:', error);
        dispatch({ type: 'TOGGLE_LOADING', payload: '' });
      });
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    dispatch({ type: 'EDIT_TASK', payload: taskToEdit });
  };

  const handleSaveEdit = (id) => {
    dispatch({ type: 'TOGGLE_LOADING', payload: 'Saving...' });
    const updatedTask = { ...tasks.find(task => task.id === id), title: editValue, body: editValue };

    fetch(`https://posts-server-94oo.onrender.com/posts/${updatedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then(response => response.json())
      .then(() => {
        dispatch({ type: 'SAVE_EDIT', payload: updatedTask });
      })
      .catch(error => {
        console.error('Error updating task:', error);
        dispatch({ type: 'TOGGLE_LOADING', payload: '' });
      });
  };

  const handleCheckTask = (id) => {
    dispatch({ type: 'TOGGLE_LOADING', payload: 'Saving...' });
    dispatch({ type: 'TOGGLE_CHECK', payload: { id } });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">To-Do List ({tasks.length})</h1>
      <AddTodo onAdd={handleAddTask} loading={loading} />
      <ul className="list-none p-0 rounded mb-6">
        {tasks.filter(task => !task.isChecked).map((task) => (
          <li key={task.id} className="mb-2 flex items-center border-b border-primary p-2">
            <input
              type="checkbox"
              className="checkbox mr-2"
              checked={task.isChecked}
              onChange={() => handleCheckTask(task.id)}
            />
            {editId === task.id ? (
              <div className="flex-grow flex items-center">
                <input
                  type="text"
                  className="input input-bordered flex-grow mr-2 bg-base-100 text-primary focus:outline-none"
                  value={editValue}
                  onChange={(e) => dispatch({ type: 'EDIT_TASK', payload: { id: editId, title: e.target.value } })}
                />
                <button
                  className={`btn btn-primary btn-sm mr-2 ${loading === 'Saving...' ? 'btn-disabled cursor-not-allowed' : ''}`}
                  onClick={() => handleSaveEdit(task.id)}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => dispatch({ type: 'EDIT_TASK', payload: null })}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex-grow flex items-center">
                <span className={`flex-grow text-primary ${task.isChecked ? 'line-through' : ''}`}>
                  {task.title}
                </span>
                <span className="text-primary text-sm ml-4">{task.datetime}</span>
                <button
                  className={`btn btn-ghost btn-sm text-primary ml-2 mr-2 ${loading === 'Deleting...' ? 'btn-disabled cursor-not-allowed' : ''}`}
                  onClick={() => handleEditTask(task.id)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className={`btn btn-ghost btn-sm text-primary ${loading === 'Deleting...' ? 'btn-disabled cursor-not-allowed' : ''}`}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mb-4 text-primary">Done ({doneCount})</h2>
      <ul className={`list-none p-0 rounded`}>
        {tasks.filter(task => task.isChecked).map((task) => (
          <li key={task.id} className="mb-2 flex items-center border-b border-primary p-2">
            <input
              type="checkbox"
              className="checkbox mr-2"
              checked={task.isChecked}
              onChange={() => handleCheckTask(task.id)}
            />
            <span className="flex-grow text-primary line-through">
              {task.title}
            </span>
            <span className="text-primary text-sm ml-4">{task.datetime}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
