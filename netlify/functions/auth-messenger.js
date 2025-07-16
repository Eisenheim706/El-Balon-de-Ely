exports.handler = async (event) => {
  // Función básica de autenticación
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: "Función de autenticación de mensajeros",
      status: "success"
    })
  };
};