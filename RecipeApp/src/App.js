import React from "react";
import "./App.css";
import Menu from './Menu/Menu';
import Loader from './Loader/Loader';
import HomePage from "./HomePage/HomePage";

function App() {
  return (
    
    <div className="App">

      <Loader />
      <Menu />
      
      <HomePage />
    </div>
  );
}

export default App;
