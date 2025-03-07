// pages/index.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PropTypes from "prop-types";
import { useRecettes } from "../context/RecettesContext";

const API_URL = "https://gourmet.cours.quimerch.com";

export default function Home() {
  const { recettes, toggleFavorite } = useRecettes();

  return (
    <main className="container">
      <h1>Liste des Recettes</h1>
      <div className="recipe-grid">
        {recettes.map((recette) => (
          <Link
            href={`/recettes/${recette.id}`}
            key={recette.id}
            className="card-link"
          >
            <div className="recipe-card">
              <button
                className="favorite-heart"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(recette.id);
                }}
                disabled={recette?.isUpdating}
                aria-label={
                  recette.isFavorite
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"
                }
              >
                {recette.isFavorite ? "❤️" : "🤍"}
              </button>
              <div className="recipe-image-container">
                {recette.image_url && (
                  <img
                    src={recette.image_url}
                    alt={recette.name}
                    className="recipe-image"
                  />
                )}
                <span className="recipe-badge">{recette.category}</span>
              </div>
              <div className="recipe-content">
                <h3 className="recipe-title">{recette.name}</h3>
                <p className="recipe-description">{recette.description}</p>
                <div className="recipe-meta">
                  <div className="meta-item">
                    <span>⏱ Prep {recette.prep_time} min</span>
                  </div>
                  <div className="meta-item">
                    <span>⏱ Cook {recette.cook_time} min</span>
                  </div>
                  <div className="meta-item">
                    <span>🔥 {recette.calories} kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  try {
    const { data } = await axios.get(`${API_URL}/recipes`, {
      headers: { Accept: "application/json" },
      timeout: 5000,
    });

    const cleanedData = Array.isArray(data)
      ? data.map((recipe) => ({
          ...recipe,
          image_url: recipe.image_url || "/images/no-image.jpg", // Corrige ici
        }))
      : [];

    const isValidData = cleanedData.every((item) => item?.id && item?.name);
    return {
      props: { recipes: isValidData ? cleanedData : [] },
    };
  } catch (error) {
    console.error("Erreur de récupération des recettes:", error);
    return { props: { recipes: [] } };
  }
}

Home.propTypes = {
  recipes: PropTypes.array,
};
