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
    const defaultImage = "https://images.pexels.com/photos/2611817/pexels-photo-2611817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";


    async function fetchRecipes() {
        const url  = "https://gourmet.cours.quimerch.com/recipes";
        setLoading(true);
        setError(null)
        console.log("Chargement des recettes...");  

        try {
            console.log("Essai du chargement des recettes...");
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur de récupération : ${response.status}`);
            }

            const data = await response.json();
            console.log("Received response json", data);
            if (Array.isArray(data)) {
                setRecipes(data);  
            } else {
                throw new Error("Format de données inattendu");
            }
            setLoading(false);
        } catch (error) {
            console.error("Erreur API :", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRecipes(); // Appel de la fonction pour récupérer les recettes
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
                        <a href={`/recipe/${recipes[carouselIndex]?.id}`}>
                        {/* Vérification avant d'afficher l'image */}
                        <img 
                            src={recipes[carouselIndex]?.image_url || defaultImage} 
                            alt={recipes[carouselIndex]?.name || "Recette"} 
                            className="recipe-image" 
                        />
                        <div className="recipe-content">
                            <h3>{recipes[carouselIndex]?.name || "Recette"}</h3>
                        </div>
                        </a>
                    </div>
                </div>
            )}

            {viewMode === 'table' && (
                <div className="recipes-grid">
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <div key={recipe.id} className="recipe-card">
                                {/* Vérification avant d'afficher l'image */}
                                <a href={`/recipe/${recipe.id}`}>
                                    <img 
                                        src={recipe?.image_url || defaultImage} 
                                        alt={recipe?.name || "Recette"} 
                                        className="recipe-image" 
                                    />
                                    <div className="recipe-content">
                                        <h3>{recipe?.name || "Recette"}</h3>
                                    </div>
                                </a>
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
                                <div className='recipe-card-slide'>
                                <a href={`/recipe/${recipe.id}`}>
                                <img 
                                    src={recipe?.image_url || defaultImage} 
                                    alt={recipe?.name || "Recette"} 
                                    className="recipe-image" 
                                />
                                <div className="recipe-content">
                                    <h3>{recipe?.name || "Recette"}</h3>
                                </div>
                                </a>
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
