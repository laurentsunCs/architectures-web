La navigation dans votre projet Next.js fonctionne grâce à plusieurs mécanismes clés combinés :

### 1. **Système de routage natif de Next.js**
- 📂 **Structure de dossiers** : Next.js utilise le dossier `pages` pour créer automatiquement les routes
  - `pages/index.js` → `/`
  - `pages/favorites.js` → `/favorites`
  - `pages/recettes/[id].js` → `/recettes/123`

### 2. **Composant `<Link>`**
```javascript
import Link from 'next/link';

// Utilisation typique
<Link href="/favorites">
  <a>Mes Favoris</a>
</Link>
```
- 🚀 **Avantages** :
  - Navigation sans rechargement de page (SPA)
  - Préchargement des pages liées
  - Gestion automatique du scroll

### 3. **Routage dynamique**
Pour les pages comme `/recettes/[id].js` :
```javascript
const router = useRouter();
const { id } = router.query; // Récupère l'ID depuis l'URL
```

### 4. **Cycle de vie de la navigation**
1. Click sur un `<Link>`
2. Next.js précharge la page cible en arrière-plan
3. Transition instantanée avec animation de chargement
4. Mise à jour de l'URL sans rechargement complet

### 5. **Gestion d'état globale**
```javascript
// Context/RecettesContext.js
const { recettes } = useRecettes();
```
- Permet de conserver les données entre les pages
- Évite les rechargements inutiles depuis l'API

### Schéma complet de navigation :
```
Utilisateur
   │
   ▼
Header (Links)
   │
   ├───▶ / (index.js) → Liste des recettes
   │        │
   │        ▼
   │        /recettes/[id] → Détail recette
   │
   ├───▶ /favorites → Filtre des recettes favorites
   │
   └───▶ /login → Authentification
```

### Bonnes pratiques supplémentaires :
- Utilisez `prefetch={false}` sur les liens peu utilisés
- Gérez les états de chargement avec `router.isFallback`
- Personnalisez les transitions avec `nprogress`

Cette combinaison de fonctionnalités Next.js et React crée une expérience de navigation fluide et professionnelle ! 🌐✨