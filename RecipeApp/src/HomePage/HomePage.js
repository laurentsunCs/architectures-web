import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';

function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0); // Pour le carrousel
    const [slideIndex, setSlideIndex] = useState(0); // Pour le basculement latéral
    const [viewMode, setViewMode] = useState('carousel'); // Mode de vue (carousel, table, slide)
    const intervalRef = useRef(null); // Référence à l'intervalle du carrousel
    const timeToSlide = 3000; // Temps pour changer d'image

    // Charger les recettes
    useEffect(() => {
        fetch("/recipes", {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des recettes");
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                setRecipes(data);
            } else {
                throw new Error("Format de données inattendu");
            }
            setLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

    // Slide automatique
    useEffect(() => {
        if (viewMode === 'slide' && recipes.length > 0) {
            intervalRef.current = setInterval(() => {
                setSlideIndex(prevIndex => (prevIndex + 1) % (recipes.length)); // Limité à l'affichage de 4 images
            }, timeToSlide); // Change l'image toutes les 3 secondes
        }
        return () => clearInterval(intervalRef.current); // Nettoie l'intervalle lors du démontage
    }, [viewMode, recipes.length]);

    // Carrousel automatique
    useEffect(() => {
        if (viewMode === 'carousel' && recipes.length > 0) {
            intervalRef.current = setInterval(() => {
                setCarouselIndex(prevIndex => (prevIndex + 1) % recipes.length);
            }, timeToSlide); // Change l'image toutes les 3 secondes
        }
        return () => clearInterval(intervalRef.current); // Nettoie l'intervalle lors du démontage
    }, [viewMode, recipes.length]);

    // Gérer la vue mode
    const changeView = (mode) => {
        setViewMode(mode);
    };

    return (
        <div className="body-container">
            <h1>Bienvenue dans mon application React !</h1>
            <p>Découvrez une sélection de recettes gourmandes.</p>

            {loading && <p className="loading">Chargement des recettes...</p>}
            {error && <p className="error">{error}</p>}

            <div className="view-controls">
                <button onClick={() => changeView('carousel')}>Carrousel</button>
                <button onClick={() => changeView('table')}>Table</button>
                <button onClick={() => changeView('slide')}>Basculement Latéral</button>
            </div>

            {viewMode === 'carousel' && (
                <div className="carousel">
                    <div
                        className="carousel-item"
                        onMouseEnter={() => clearInterval(intervalRef.current)} // Arrêter le carrousel au survol
                        onMouseLeave={() => {
                            intervalRef.current = setInterval(() => {
                                setCarouselIndex(prevIndex => (prevIndex + 1) % recipes.length);
                            }, 3000);
                        }}
                    >
                        {/* Vérification avant d'afficher l'image */}
                        <img 
                            src={recipes[carouselIndex]?.image_url || "https://via.placeholder.com/150"} 
                            alt={recipes[carouselIndex]?.name || "Recette"} 
                            className="recipe-image" 
                        />
                        <div className="recipe-content">
                            <h3>{recipes[carouselIndex]?.name || "Recette"}</h3>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'table' && (
                <div className="recipes-grid">
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <div key={recipe.id} className="recipe-card">
                                {/* Vérification avant d'afficher l'image */}
                                <img 
                                    src={recipe?.image_url || "https://via.placeholder.com/150"} 
                                    alt={recipe?.name || "Recette"} 
                                    className="recipe-image" 
                                />
                                <div className="recipe-content">
                                    <h3>{recipe?.name || "Recette"}</h3>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && <p className="no-recipes">Aucune recette disponible.</p>
                    )}
                </div>
            )}

            {viewMode === 'slide' && (
                <div className="slide-view">
                    <div className="slide-container" style={{ transform: `translateX(-${slideIndex * 25}%)` }}>
                        {recipes.map((recipe, index) => (
                            <div 
                                key={recipe.id} 
                                className={`slide-item ${index === slideIndex ? 'active' : 
                                            (index === slideIndex + 1 ? 'next' : 
                                            (index === slideIndex - 1 ? 'previous' : ''))}`}
                            >
                                {/* Vérification avant d'afficher l'image */}
                                <img 
                                    src={recipe?.image_url || "https://via.placeholder.com/150"} 
                                    alt={recipe?.name || "Recette"} 
                                    className="recipe-image" 
                                />
                                <div className="recipe-content">
                                    <h3>{recipe?.name || "Recette"}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
