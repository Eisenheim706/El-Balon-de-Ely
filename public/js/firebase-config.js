async function loadFirebaseConfig() {
  try {
    const response = await fetch('/.netlify/functions/get-config');
    const config = await response.json();
    
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(config);
      console.log("Firebase configurado con función");
    }
  } catch (error) {
    console.error("Error cargando configuración:", error);
    // Configuración de respaldo
    const backupConfig = {
      apiKey: "TU_API_KEY_FALLBACK",
      // ... otras claves de respaldo ...
    };
    
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(backupConfig);
      console.log("Firebase configurado con valores de respaldo");
    }
  }
}

// Llamar a la función al cargar
loadFirebaseConfig();