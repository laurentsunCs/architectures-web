
# Documentation des Endpoints de l'API Gourmet

## Authentication (Auth)

### Connexion
**POST** `/login`
- **Description** : Authentifie un utilisateur et retourne un token.
- **Paramètres** :
  - `redirect` (query, optionnel) : URL de redirection après connexion.
- **Body** (JSON) :
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Réponse** :
  ```json
  {
    "token": "string"
  }
  ```

### Déconnexion
**GET** `/logout`
- **Description** : Déconnecte l'utilisateur.

### Profil utilisateur
**GET** `/me`
- **Description** : Récupère les informations du profil utilisateur.
- **Réponse** :
  ```json
  {
    "username": "string",
    "email": "string",
    "full_name": "string",
    "created_at": "string"
  }
  ```

---

## Favoris (Favorites)

### Récupérer les favoris
**GET** `/favorites`
- **Description** : Liste des recettes favorites de l'utilisateur.
- **Réponse** :
  ```json
  [
    {
      "recipe": {
        "id": "string",
        "name": "string",
        "description": "string",
        "image_url": "string",
        "category": "string",
        "prep_time": 30,
        "cook_time": 45,
        "servings": 4
      }
    }
  ]
  ```

### Supprimer un favori
**DELETE** `/users/{username}/favorites`
- **Description** : Supprime une recette des favoris.
- **Paramètres** :
  - `username` (path) : Nom d'utilisateur.
  - `recipeID` (query) : Identifiant de la recette.

---

## Recettes (Recipes)

### Liste des recettes
**GET** `/recipes`
- **Description** : Récupère la liste des recettes.
- **Réponse** :
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "image_url": "string",
      "category": "string",
      "prep_time": 30,
      "cook_time": 45,
      "servings": 4
    }
  ]
  ```

### Détails d'une recette
**GET** `/recipes/{id}`
- **Description** : Récupère les détails d'une recette spécifique.
- **Paramètres** :
  - `id` (path) : Identifiant de la recette.

### Recettes similaires
**GET** `/recipes/{id}/related`
- **Description** : Récupère les recettes similaires.
- **Paramètres** :
  - `id` (path) : Identifiant de la recette.

### Nombre de favoris en temps réel
**GET** `/recipes/{id}/stars`
- **Description** : Nombre de fois qu'une recette a été ajoutée aux favoris.
- **Paramètres** :
  - `id` (path) : Identifiant de la recette.

```

Ce document contient les endpoints principaux de l'API liés à l'authentification, aux favoris et aux recettes. Si tu veux inclure d'autres catégories ou plus de détails, dis-moi ! 😊