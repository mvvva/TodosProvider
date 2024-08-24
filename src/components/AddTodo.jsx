import React, { useState } from 'react';

const AddTodo = ({ onAdd, loading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTask = () => {
    if (inputValue.trim() !== '') {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  const getButtonBackgroundColor = () => {
    switch (loading) {
      case 'Adding...':
        return 'btn-disabled cursor-not-allowed';
      case 'Saving...':
        return 'bg-warning';
      case 'Deleting...':
        return 'bg-error';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="flex justify-between mb-4">
      <input
        type="text"
        className="input input-bordered w-full mr-2 bg-neutral text-neutral-content"
        placeholder="Add new task"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className={`btn ${getButtonBackgroundColor()} w-[110px] `}
        onClick={handleAddTask}
      >
        {loading ? `${loading}` : 'Add'}
      </button>
    </div>
  );
};

export default AddTodo;
