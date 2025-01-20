let temperaturaSeleccionada = "";

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
        let textoSeleccionado = $(this).text().trim();
        temperaturaSeleccionada = textoSeleccionado;
        obtenerTemperatura();
        
      });
    });
  });
  // Función para obtener la temperatura seleccionada
  function obtenerTemperatura() {
    console.log("Temperatura seleccionada desde la función:",temperaturaSeleccionada);
    return temperaturaSeleccionada; 
  }

  $("#btn_buscar").click(function () {
    console.log("Temperatura seleccionada al presionar Buscar:", obtenerTemperatura());
  });
});
