let temperatura = "";
let clima = "";
let viento = "";
let precipitaciones = "";

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

  function convertir_a_datos(temperatura, precipitaciones, viento) {
    let filtros = {};

    // Solo asignamos los valores seleccionados, sin necesidad de rangos
    if (temperatura) filtros.temperatura = temperatura;
    if (precipitaciones) filtros.precipitaciones = precipitaciones;
    if (viento) filtros.viento = viento;

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
      ),
    ]);
  }
  function mostrarCiudades(ciudades) {
    const resultadosContainer = document.getElementById("resultados");
    const contenedorResultados = document.querySelector(".secondary-column");

    // Verifica que los elementos existen
    if (!resultadosContainer || !contenedorResultados) return;

    // Limpia el contenido anterior
    resultadosContainer.innerHTML = "";

    // Si no hay ciudades, oculta todo el contenedor
    if (ciudades.length === 0) {
      contenedorResultados.style.display = "none";
      return;
    }

    // Muestra el contenedor de resultados
    contenedorResultados.style.display = "flex";

    // Limitar a 3 resultados
    const ciudadesMostradas = ciudades.slice(0, 4);

    // Recorre cada ciudad y crea un elemento HTML para mostrarla
    ciudadesMostradas.forEach((ciudad) => {
      const ciudadElement = document.createElement("div");
      ciudadElement.className = "ciudad";
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
    console.log(
      "Filtros seleccionados y a buscar:",
      filtros.temperatura,
      filtros.precipitaciones,
      filtros.viento
    );
    
    // Construcción de la URL correctamente
    let url = `https://climaapi-production.up.railway.app/filtrar?temperatura=${filtros.temperatura}&precipitaciones=${filtros.precipitaciones}&viento=${filtros.viento}`;

    console.log("Consultando API con URL:", url);

    const response = await fetchConTimeout(url, 50000); // Espera máximo 50 segundos

    if (!response.ok) {
      const errorResponse = await response.text(); // o response.json() si la API devuelve JSON
      throw new Error(
        `Error HTTP: ${response.status}, Response: ${errorResponse}`
      );
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
