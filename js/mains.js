let temperatura = "";
let clima = "";
let viento = "";

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
        } else if (id_dropdown == "clima") {
          clima = valorseleccionado;
        } else if (id_dropdown == "viento") {
          viento = valorseleccionado;
        }
      });
    });
  });

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
    console.log("Datos seleccionados al presionar Buscar:", consultarDatos());
  });

  // Función consultar datos seleccionados con los de la API

  function consultarDatos() {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => {
        console.log("Datos obtenidos:", data);
      })
      .catch(error => {
        console.error("Error al obtener datos:", error);
      });
  }
  
});
