import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router";
import { LoadingProvider } from "./Common/Loader/LoadingContext";

function App() {
  

  return (
    <LoadingProvider>
      <div className="App">
      <RouterProvider router={router}>
      </RouterProvider>
      </div>
    </LoadingProvider>
  );
}

export default App;
