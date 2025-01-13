export async function actualizarBuild() {
    try {
      // Realiza la solicitud POST a la API externa como lo haría el comando curl
      const response = await fetch('https://api.netlify.com/build_hooks/6783eb69227cc48642c468c3', {
        method: 'POST',  // Especificar el método POST
        headers: {
          // Los headers pueden ser necesarios dependiendo de la API que estés usando.
          // Si no se requiere, puedes omitir esta parte.
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el sitio');
      }
  
      return 'Actualización exitosa'; // Mensaje de éxito si todo va bien
    } catch (error) {
      console.error('Error en la actualización:', error); // Log de errores en la consola
      throw new Error('Error en la actualización');
    }
  }
  