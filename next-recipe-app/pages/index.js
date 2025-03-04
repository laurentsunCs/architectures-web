// pages/index.js
import React from "react";
import axios from "axios";
import Link from "next/link";
import PropTypes from "prop-types";
import { useRecettes } from "../context/RecettesContext";

const API_URL = "https://gourmet.cours.quimerch.com";

export default function Home() {
  const { recettes } = useRecettes();

  return (
    <main className="container">
      <h1>Liste des Recettes</h1>
      <div className="recipe-grid">
        {recettes.map((recette) => (
          <div key={recette.id} className="recipe-card">
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
              <h3 className="recipe-title">
                <Link href={`/recettes/${recette.id}`}>{recette.name}</Link>
              </h3>
              <p className="recipe-description">{recette.description}</p>
              <div className="recipe-meta">
                <div className="meta-item">
                  <span>⏱ {recette.prep_time} min</span>
                </div>
                <div className="meta-item">
                  <span>🔥 {recette.calories} kcal</span>
                </div>
              </div>
            </div>
          </div>
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

    const isValidData =
      Array.isArray(data) && data.every((item) => item?.id && item?.name);

    return {
      props: { recipes: isValidData ? data : [] },
    };
  } catch (error) {
    console.error("Erreur de récupération des recettes:", error);
    return { props: { recipes: [] } };
  }
}

Home.propTypes = {
  recipes: PropTypes.array,
};
