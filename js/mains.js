let temperatura = "";
let clima = "";
let viento = "";
let precipitaciones="";



window.addEventListener("DOMContentLoaded", () => {
  // Menu con movimiento
  $(document).ready(function () {
    $(".dropdown").click(function () {
      let parentContainer = $(this).closest(".dropdown-container");
      let menu = parentContainer.find(".menu");

      $(".menu").not(menu).removeClass("showMenu"); // Cierra otros menús
      menu.toggleClass("showMenu");

      menu.find("li").click(function () {
        parentContainer.find(".dropdown > p").html($(this).html());
        menu.removeClass("showMenu");
        let valorseleccionado = $(this).text().trim();
        let id_dropdown = parentContainer.attr("id");

        if (id_dropdown == "temperatura") {
          temperatura = valorseleccionado;
        } else if (id_dropdown == "precipitaciones") {
          precipitaciones = valorseleccionado;
        } else if (id_dropdown == "viento") {
          viento = valorseleccionado;
        }
      });
    });
  });

  function convertir_a_datos (temperatura, precipitaciones, viento){
   let filtros= {};
   // Convertir temperatura a un valor mínimo (podríamos usar un rango)
  if (temperatura === "Frío") filtros.temperatura = "0";
  else if (temperatura === "Templado") filtros.temperatura = "10";
  else if (temperatura === "Cálido") filtros.temperatura = "21";
  else if (temperatura === "Caluroso") filtros.temperatura = "30";

  // Convertir precipitaciones
  if (precipitaciones === "Seco") filtros.precipitaciones = "0";
  else if (precipitaciones === "Moderado") filtros.precipitaciones = "2";
  else if (precipitaciones === "Lluvioso") filtros.precipitaciones = "11";
  else if (precipitaciones === "Muy lluvioso") filtros.precipitaciones = "30";

  // Convertir viento
  if (viento === "Calma") filtros.viento = "0";
  else if (viento === "Brisa") filtros.viento = "10";
  else if (viento === "Ventoso") filtros.viento = "31";
  else if (viento === "Muy ventoso") filtros.viento = "60";

  return filtros;
    }


  $("#btn_buscar").click(function () {
    console.log("Datos seleccionados al presionar buscar:", consultarDatos());    
  });

  // Función para hacer fetch con un timeout de 50 segundos
async function fetchConTimeout(url, timeout = 50000) {
  return Promise.race([
    fetch(url), // Petición normal
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Tiempo de espera agotado")), timeout)
    )
  ]);
}

function mostrarCiudades(ciudades) {
  // Obtén el contenedor donde se mostrarán los resultados
  const resultadosContainer = document.getElementById("resultados");

  // Limpia el contenido anterior del contenedor
  resultadosContainer.innerHTML = "";

  // Si no hay ciudades, muestra un mensaje
  if (ciudades.length === 0) {
    resultadosContainer.innerHTML = "<p>No se encontraron ciudades con los criterios seleccionados.</p>";
    return;
  }

  // Recorre cada ciudad y crea un elemento HTML para mostrarla
  ciudades.forEach((ciudad) => {
    const ciudadElement = document.createElement("div");
    ciudadElement.className = "ciudad"; // Añade una clase para estilos CSS
    ciudadElement.innerHTML = `
      <h3>${ciudad.Ciudad}</h3>
      <p>Temperatura: ${ciudad.Temperatura}°C</p>
      <p>Precipitaciones: ${ciudad.Precipitaciones} mm</p>
      <p>Viento: ${ciudad.Viento} km/h</p>
      <p>Presión: ${ciudad.Presion} hPa</p>
    `;
    resultadosContainer.appendChild(ciudadElement);
  });
}

// Función consultar datos seleccionados con los de la API
async function consultarDatos() { 
  try {
    let filtros = convertir_a_datos(temperatura, precipitaciones, viento);
    console.log("filtros seleccionados y a buscar:",temperatura, precipitaciones, viento);
    let url = `https://climaapi-production.up.railway.app/filtrar?temperatura=${filtros.temperatura}&precipitaciones=${filtros.precipitaciones}&viento=${filtros.viento}`;

    console.log("Consultando API con URL:", url);

    const response = await fetchConTimeout(url, 50000); // Espera máximo 50 segundos

    if (!response.ok) {
      const errorResponse = await response.text(); // o response.json() si la API devuelve JSON
      throw new Error(`Error HTTP: ${response.status}, Response: ${errorResponse}`);
    }

    const data = await response.json();
    console.log("Datos obtenidos:", data);

    // Muestra las ciudades en la página
    mostrarCiudades(data);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
}



  
});
