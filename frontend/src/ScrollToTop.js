// ScrollToTop.js
// src/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Forzar scroll al top en cada cambio de ruta
    window.scrollTo({
      top: 0,
      behavior: "auto", // puedes poner "smooth" si prefieres
    });
  }, [pathname]);

  return null;
}

