import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Recipe from "../pages/Recipes/Recipe";
import RootLayout from "./RootLayout";
import ErrorPage from "../Common/Error/Error";
import { useState } from "react-dom";


let id_ = "" 
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Layout contenant le Menu + Outlet pour afficher les pages
    errorElement: <ErrorPage />, // Page d'erreur si la route n'existe pas
    children: [
      { index: true, element: <HomePage /> }, // Route principale "/"
      {path: "recipe/", element: <HomePage/>},
      { path: "recipe/:id", element: <Recipe id=":id"/>, errorElement: <ErrorPage /> , 

             },
             // Route "/about"
      //{ path: "contact", element: <ContactPage /> }, // Route "/contact"
    ],
  },
]);

export default router;
