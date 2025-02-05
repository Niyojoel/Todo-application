import React from "react";
import './App.css';
import Todoapp from './Todoapp.jsx';
import { TodoProvider } from "./todoContext.jsx";


function App() {
  return (
    <TodoProvider>
      <div className="App">
        <Todoapp/> 
      </div>
  </TodoProvider>
  );
}

export default App;