import React, {useState, useEffect} from "react";
import "./LikeRecipe.css";
import { useUser } from "../../../Common/UserContext/UserContext";
import { useAuth } from "../../../Common/AuthProvider/AuthProvider";

function LikeRecipeButton(props) {
    
    
    const [like, setLike] = useState(false);

   
    const { userInfo, fetchUserInfo } = useUser(); // Récupérer les informations utilisateur du contexte
    const { authToken } = useAuth(); // Récupérer le token d'authentification via le contexte Auth
  
    useEffect(() => {
      if (authToken && !userInfo) {
        // Si le token est disponible et que les informations utilisateur ne sont pas encore récupérées
        fetchUserInfo(authToken); // Appeler la fonction pour récupérer les infos utilisateur
      }
    }, [authToken, userInfo, fetchUserInfo]); // Dépendances : authToken et userInfo
  
    if (!userInfo) {
      //return <p>Chargement des informations...</p>; // Afficher un message pendant le chargement
    }

    console.log("User Info", userInfo);
    const url_post_like = `https://gourmet.cours.quimerch.com/users/${userInfo.username}/favorites?recipeID=${props.recipe_id}`;
  
    
    async function clickLike() {


        try{
            const response = await fetch(url_post_like, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                    
                },
    
            });
            if (!response.ok) {
                throw new Error(`Erreur API : ${response.status}`);
            }  
            
    
            setLike(!like);
        }
        catch (error) {
            console.error("Erreur API :", error.message);
        }


    }
    
    return (
        <div className="LikeRecipe">
        <button onClick={clickLike}>
            {like ? "Je n'aime plus" : "J'aime"}
        </button>
        </div>
    ); 
    }

export default LikeRecipeButton;