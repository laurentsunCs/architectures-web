import React from "react";
import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return (
    <div>
      <h1>Oops! Cette page n'existe pas.</h1>
      <p>{error.statusText || error.message}</p>
    </div>
  );
}

function ErrorPageRecipe() {
  return (
    <div>
      <h1>Oops! Cette recette n'existe pas.</h1>
      <p>Erreur 404</p>
    </div>
  );
}

export default ErrorPage;
