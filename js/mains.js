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


  /* // Función para obtener los datos seleccionados
  function obtenerDatos() {
    console.log("Temperatura seleccionada:", temperatura);
    console.log("Clima seleccionado: ", clima);
    console.log("Viento seleccionado:", viento);
    return {
      temperatura,
      clima,
      viento,
    };
  } */

  $("#btn_buscar").click(function () {
    console.log("Datos seleccionados al presionar buscar:", consultarDatos());    
  });

  // Función consultar datos seleccionados con los de la API

  async function consultarDatos() {
    try {
        let filtros = convertir_a_datos(temperatura, precipitaciones, viento);
        let url = `https://clima-api-bp73.onrender.com/filtrar?temperatura=${filtros.temperatura}&precipitaciones=${filtros.precipitaciones}&viento=${filtros.viento}`;
        
        console.log("Consultando API con URL:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Datos obtenidos:", data);
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

 

  
});
