let temperatura = "";
let precipitaciones = "";
let viento = "";

$(document).ready(function () {
  // Menú desplegable con selección
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

  function convertir_a_datos(temperatura, precipitaciones, viento) {
    let filtros = {};
    if (temperatura) filtros.temperatura = temperatura;
    if (precipitaciones) filtros.precipitaciones = precipitaciones;
    if (viento) filtros.viento = viento;
    return filtros;
  }

  $("#btn_buscar").click(async function () {
    console.log("Datos seleccionados al presionar buscar");
    await consultarDatos();
  });

  async function fetchConTimeout(url, timeout = 50000) {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), timeout)
      ),
    ]);
  }

  function mostrarCiudades(ciudades) {
    const resultadosContainer = document.getElementById("resultados");
    const contenedorResultados = document.querySelector(".secondary-column");

    if (!resultadosContainer || !contenedorResultados) return;

    resultadosContainer.innerHTML = "";

    if (ciudades.length === 0) {
      tituloResultados.innerHTML =
        "<p>A veces, el clima perfecto es difícil de encontrar. Vuelve a intentarlo</p>";
        contenedorResultados.style.display = "flex"; // Asegurar que la columna sea visible 
      return;
    }

    contenedorResultados.style.display = "flex";

    const ciudadesMostradas = ciudades.slice(0, 4);

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

  async function consultarDatos() {
    try {
      let filtros = convertir_a_datos(temperatura, precipitaciones, viento);
      console.log(
        "Filtros seleccionados y a buscar:",
        filtros.temperatura,
        filtros.precipitaciones,
        filtros.viento
      );

      let url = `https://climaapi-production.up.railway.app/filtrar?temperatura=${filtros.temperatura || ""}&precipitaciones=${filtros.precipitaciones || ""}&viento=${filtros.viento || ""}`;

      console.log("Consultando API con URL:", url);

      const response = await fetchConTimeout(url, 50000);

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(
          `Error HTTP: ${response.status}, Response: ${errorResponse}`
        );
      }

      const data = await response.json();
      console.log("Datos obtenidos:", data);

      mostrarCiudades(data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }
});
