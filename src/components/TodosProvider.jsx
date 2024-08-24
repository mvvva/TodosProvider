import React, { createContext, useReducer, useContext } from 'react';


const initialState = {
  tasks: [],
  loading: '',
  editId: null,
  editValue: '',
  doneCount: 0,
};

function todosReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        doneCount: action.payload.filter(task => task.isChecked).length,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        loading: '',
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        loading: '',
      };
    case 'EDIT_TASK':
      return {
        ...state,
        editId: action.payload.id,
        editValue: action.payload.title,
      };
    case 'SAVE_EDIT':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
        editId: null,
        editValue: '',
        loading: '',
      };
    case 'TOGGLE_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'TOGGLE_CHECK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, isChecked: !task.isChecked } : task
        ),
        doneCount: state.tasks.filter(task => task.isChecked).length,
        loading: '',
      };
    default:
      return state;
  }
}

const TodosContext = createContext();

export const TodosProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todosReducer, initialState);

  return (
    <TodosContext.Provider value={{ state, dispatch }}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
