import React from 'react';
import TodoList from './components/TodoList';
import { TodosProvider } from './components/TodosProvider';

function App() {
  return (
    <TodosProvider>
      <div className="min-h-screen flex items-center justify-center bg-[#0D0714] p-4">
      <div className="wrapper w-[800px] bg-[#1B1622] p-3 rounded-2xl">
        <TodoList />


      </div>

    </div>
    </TodosProvider>
  );
}

export default App;
