import React, { useEffect, useState } from "react";
import "./Loader.css";

function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    setTimeout(function() {
      setLoading(false);
    }, 100); // Temps d'affichage du loader
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  } else {
    return null;
  }
}

export default Loader;
