import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router";
import { LoadingProvider } from "./Common/Loader/LoadingContext";
import { AuthProvider } from "./Common/AuthProvider/AuthProvider";
import { UserProvider } from "./Common/UserContext/UserContext";

function App() {
  

  return (
    <AuthProvider>
      <UserProvider>
    <LoadingProvider>
      <div className="App">
      <RouterProvider router={router}>
      </RouterProvider>
      </div>
    </LoadingProvider>
    </UserProvider>
    </AuthProvider>
  );
}

export default App;
