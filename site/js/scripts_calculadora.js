
$(document).ready(function(){

  var acc_valor = 0, acc_op = "", mem_valor = 0, lcd_valor="";
  var lastCaret = -1;

  $("#mem_valor").html("");
  borraLCD();
  // setCaret(-1);
  muestra_buenos();
  muestra_memoria();
  // $("#lcd").focus();
  

  $( "#lcd" ).draggable({
    containment: "#cabecera",
    cursor: "move",
    revert: "invalid",
    helper: "clone",
    opacity: 0.65
  }).on({
    dragstart: function (e, ui) {
      $(ui.helper).css('z-index','999999');
      $(ui.helper).css('text-align', 'right');
    },
    focus: function (e, ui) {
      setCaret(lastCaret);
    },
    'blur keyup paste input': function (e, ui) {
      lastCaret = getCaret();
    }
  });

  $( "#mem_valor" ).draggable({
    containment: "#cabecera",
    cursor: "move",
    revert: "invalid",
    helper: "clone",
    opacity: 0.65         
  }).on(
    'dragstart', function (e, ui) {
      $(ui.helper).css('z-index','999999');
      $(ui.helper).css('text-align', 'right');
  });

  $( "#lcd").droppable({
    accept: "#mem_valor",
    activeClass: "lcd-active",
    drop: function(event, ui) {
      var contenido = $("#mem_valor").html();
      $(this).html(contenido);
      $(this).effect("highlight");
    }
  });

  $( "#mem_valor").droppable({
    accept: "#lcd",
    activeClass: "memoria-active",
    drop: function(event, ui) {
      var contenido = $("#lcd").html();
      if (es_valido(contenido)) {
        $(this).html(contenido);
        $(this).effect("highlight");
      }
    }
  });

  function getCaret() {
    return $("#lcd").caret();
  }

  function setCaret(pos) {
    if (pos === -1) {
        var len = ($("#lcd").html()).length;
        if (len > 0) {
          lastCaret = len;
          $("#lcd").caret(lastCaret);
        }
    } else 
    if (pos > -1 && ($("#lcd").html()).length >= pos) {
      lastCaret = pos;
      $("#lcd").caret(lastCaret);
    } else 
      lastCaret = -1;

  }

  function borraLCD() {
    $("#lcd").html("");
    lastCaret = -1;
  }


  function limpiaLCD() {
      var lcd = $("#lcd");
      var valor = lcd.html();
      if (valor === "0" || valor === "Infinity" || valor === "NaN") {
        borraLCD();
      }
  }

  function resetea_acumulado() {
      $("#acc_valor").text("");
      $("#acc_operador").text("");
      acc_valor = 0;
      acc_op = "";
  }


  function muestra_memoria() {
    if (mem_valor == 0) {
      $("#mem_valor").html("");

    } else {
      $("#mem_valor").html(mem_valor);
    }
  }

  function muestra_buenos() {
    var fecha = new Date();
    var msj;

    if      (fecha.getHours() < 7)  { msj = "Buenas noches";}
    else if (fecha.getHours() < 12) { msj = "Buenos días";}
    else if (fecha.getHours() < 21) { msj = "Buenas tardes";}
    else                            { msj = "Buenas noches";}

    $("#buenos").html(msj);
   }

   function error(titulo, mensaje) {
    /*
      Utiliza Bootbox, que es una librería que permite crear facilmente dialog boxes.
      url: http://bootboxjs.com/
    */
    bootbox.alert({
      title: titulo,
      message: mensaje,
      buttons: {
          'ok': {
              label: 'Aceptar',
              className: 'btn-warning pull-right'
          }
      },
      callback: function(result) {}
    });

   }

   function info(titulo, mensaje) {
      bootbox.alert({
        title: titulo,
        message: mensaje,
        buttons: {
            'ok': {
                label: 'Aceptar',
                className: 'btn-info pull-right'
            }
        },
        callback: function(result) {}
      });

   }



   /*Comprueba que el valor pasado como parámetro, sea un valor
   numérico, un campo vacío o el valor infinito tanto positivo como
   negativo*/
   function es_valido(valor) {
    if (valor ==="" || valor === "Infinity" || valor === "-Infinity") {
      // Si está vacío no lo damos como error, ya que 
      // se convertirá a cero
      // Si es infinito tampoco lo damos como error, ya que
      // se puede operar con números infinitos
      return true;
    } else if (!$.isNumeric(valor)) {
      // Si es un valor NO numérico, SI que es un error
      error(
        '¡Error en datos!',
        '"' + valor + '" no es un número correcto');
      return false;
    } 
    return true;
   }


  /** Calcula el factorial de n.*/
  var f = [];
  function factorial (n) {
    if (n == 0 || n == 1)
      return 1;
    if (f[n] > 0)
      return f[n];
    return f[n] = factorial(n-1) * n;
  }

  /*Si se muestra la tecla info mostramos el cuadro de información*/
  $("#b_info").on("click", 
    function() {
      info("Calculadora v1.0", "Calculadora realizada con bootstrap y jQuery");
    });

  /*Si se pulsa una tecla numérica, añadimos al LCD 
  el valor correspondiente a dicha tecla*/
  $(".btn_numero").on("click", 
    function(){
      limpiaLCD();
      var lcd = $("#lcd");
      var string = lcd.html();
      var valor_tecla = $(this).text();
      if (lastCaret < 1) {
        lcd.html(lcd.html() + valor_tecla);
        setCaret(1);
      }
      else {
        var result = [string.slice(0, lastCaret), valor_tecla, string.slice(lastCaret)].join('');
        lcd.html(result);
        setCaret(lastCaret + 1);
      }
    });

  /* Si pulsamos la tecla de borrar(C), vaciamos el
  contenido del input LCD y los acumuladores.
  Pero mantenemos el contenido de la memoria */
  $(".op_borrar").on("click", 
    function(){ 
      var operacion = $(this).attr('id');
      if (operacion === "b_borrar") {
        borraLCD();
        resetea_acumulado();
        mem_valor = 0;
        muestra_memoria();
      } else if (operacion === "b_borrar_parcial") {
        borraLCD();
      }
   });

   /* Muestra los datos del acumulador */
   function muestra_acumulado(valor, operador) {
        $("#acc_valor").text(valor);
        if (operador === "b_suma")
          $("#acc_operador").text("+");
        else if (operador === "b_resta")
          $("#acc_operador").text("-");
        else if (operador === "b_multiplica")
          $("#acc_operador").text("*");
        else if (operador === "b_divide")
          $("#acc_operador").text("/");
        else if (operador === "b_eleva")
          $("#acc_operador").text("^");
   }


  /*Si pulsamos la tecla de un operador binario, 
  primero miramos si había alguna operación pendiente en el
  acumulador y la realizamos. 
  A continuación, actualizamos los acumuladores
  con el nuevo valor del display y el id de la tecla de operación, 
  y mostramos dichos valores en la parte superior. 
  Por último borramos el contenido del lcd*/
  $(".op_binario").on("click", 
    function() {
      var lcd = $("#lcd");
      // almacenamos temporalmente los acumuladores existentes
      var temp_acc_valor = acc_valor;
      var temp_acc_op = acc_op;

      // cogemos los nuevos datos
      var new_valor = lcd.html();
      var new_op = $(this).attr('id');

      // Primero comprobamos que el valor del LCD sea un número correcto.
      // De lo contrario abandonamos la operación

      if (!es_valido(new_valor)) 
        return;
      
      // Si había alguna operación almacenada en el acumulador,
      // procesamos dicha operación, actualizamos el acumulador
      // con dicho resultado y el operador actual, y reseteamos el
      // lcd;

      if (temp_acc_op !== "") {
        // Si había alguna operación almacenada en el acumulador,
        // procesamos dicha operación, actualizamos el acumulador
        // con dicho resultado y el operador actual, y reseteamos el
        // lcd;

        var resultado = calculo_binario(+new_valor, temp_acc_valor, temp_acc_op);
        acc_valor = resultado;
        acc_op = new_op;
      } else {
        // Si no había ninguna operación pendiente, realizamos
        // actualizamos el acumulador con el valor del lcd y la operacion
        // actual

        acc_valor = +new_valor;
        acc_op = new_op;

      }
      // Mostramos el nuevo acumulador y reseteamos el display
      muestra_acumulado(acc_valor, acc_op);
      borraLCD();
    });

  /* Devuelve el resultador de la operación binaria realizada
  con los 2 valores y el operador pasados como parámetros */
  function calculo_binario(dato_nuevo, dato_antiguo, operador) {
        if (operador === "b_suma") {
          return (+dato_antiguo + dato_nuevo)
        } else if (operador === "b_resta") {
          return (+dato_antiguo - dato_nuevo)
        } else if (operador === "b_multiplica") {
          return (+dato_antiguo * dato_nuevo)
        } else if (operador === "b_divide") {
          return (+dato_antiguo / dato_nuevo)
        } else if (operador == "b_eleva") {
          return (Math.pow(+dato_antiguo, dato_nuevo));
        } else {
          // Si no es ninguno de los operadores
          // simplemente devolvemos el dato_nuevo, para que no cambie
          // el valor del LCD
          return dato_nuevo;
        }
  }

  /*Si pulsamos una tecla de calcular, realizamos la función de cálculo binario,
  pasándole como parámetros el valor del lcd y el valor y operador almacenados en 
  el acumulador.
  A continuación, reseteamos los acumuladores*/
  $(".op_calcular").on("click", 
    function() {
      var lcd = $("#lcd");
      if (es_valido(lcd.html())) {
        var resultado = calculo_binario(+lcd.html(), +acc_valor, acc_op);
        lcd.html(resultado);
        resetea_acumulado();
        setCaret(-1)
      }
    });

  /*Si pulsamos la tecla de un operador unitario, realizamos la función que 
  le corresponda y borramos el acumulado*/
  $(".op_unitario").on("click", 
    function() {
      var lcd = $("#lcd");
      var operacion = $(this).attr('id');

      //Para la operación de borrar no comprobamos
      //si el número es correcto,
      //Para el resto si
      if (operacion == 'b_atras') {
        var index = lcd.caret();
        var valor = lcd.html();
        if (valor === "Infinity" || valor == "NaN") {
          borraLCD();
          return;
        }
        if (index > 0) {
          var sub1 = valor.substr(0, index-1);
          var sub2 = valor.substr(index, valor.length);
          valor = sub1 + sub2;
          if (valor === "") {
            borraLCD();
          } else  {
            lcd.html(valor);
            setCaret(index-1);
          }
        }
        return;
      }
      
      if (es_valido(lcd.html())) {
        // Elevar el número al cuadrado      
        if (operacion === "b_cuadrado") { 
          lcd.html(+lcd.html() * +lcd.html());
          setCaret(-1);
        }

        // Invertir el número
        if (operacion === "b_invertido") {
          lcd.html(1 / +lcd.html());
          setCaret(-1);
        }

        // Raíz cuadrada del número
        if (operacion === "b_raiz") {
          lcd.html(Math.sqrt(+lcd.html()));
          setCaret(-1);
        }

        // Entero del número
        if (operacion === "b_entero") {
          if (lcd.html() > 0)
            lcd.html(Math.floor(+lcd.html()));
          else
            lcd.html(Math.ceil(+lcd.html()));
          setCaret(-1);
        }

        // Cambiar signo
        if (operacion === "b_signo") {
          lcd.html(-lcd.html());
          setCaret(-1);
        }

        // Potencia de 2
        if (operacion === "b_potencia2") {
          lcd.html(Math.pow(2, +lcd.html()));
          setCaret(-1);
        }

        // Factorial
        if (operacion === "b_factorial") {
          // Para calcular el factorial debemos comprobar que es un número entero positivo
          if (+lcd.html()<0) {
            error(
              "¡Error!",
              "El número ha de ser mayor o igual que cero para calcular el factorial");
          } else if (+lcd.html() % 1 !== 0) { 
            error(
              "¡Error!",
              "El número ha de ser entero para calcular el factorial");
          } else if (+lcd.html() > 170) { 
            error(
              "¡Error!",
              "Número fuera de límites para calcular el factorial. Máximo valor admitido: 170");
          } else {
            lcd.html(factorial(+lcd.html()));
          }
          setCaret(-1);
        }
      }
    });

  /* Procesamos que se ha pulsado una de las teclas de
  operación con la memoria */
  $(".btn_memoria").on("click", 
    function() {
      var lcd = $("#lcd");
      var operacion = $(this).attr('id');

      if (operacion === "b_mc") {
        // borramos la memoria
        mem_valor = 0;
      }

      if (operacion === "b_mr") {
        // recuperamos el contenido de la memoria y 
        // se lo asignamos a lcd
          lcd.html(+mem_valor);
          setCaret(-1);

      }

      if (operacion === "b_ms") {
        // almacena el contenido de lcd en memoria
        if (es_valido(lcd.html()))
          mem_valor = +lcd.html();
      }

      if (operacion === "b_mmas") {
        // suma el contenido del lcd a la memoria
        if (es_valido(lcd.html()))
          mem_valor = mem_valor + +lcd.html();
      }

      if (operacion === "b_mmenos") {
        // resta el contenido del lcd de la memoria
        if (es_valido(lcd.html()))
          mem_valor = mem_valor - +lcd.html();
      }

      // mostramos el contenido de la memoria
      muestra_memoria();


    });

  /** Si pulsa el boton de sumar o multiplicar cadenas,
  primero dividimos el contenido del lcd en un array
  y luego lo procesamos según el botón seleccionado */
  $(".op_varios").on("click", 
    function() {
      var texto = $("#lcd").html();
      var operacion = $(this).attr('id');

      var array = texto.split(",");
      var total = 0;

      // comprobamos que todos los elementos del array
      // sean númericos
      var error = false;

      $.each(array, function() {
        if (!es_valido(this)) {
          error = true;
          return false;
        }
      });

      if (error) return false;

      // calculamos el total según la operación a procesar
      if (operacion === "b_sumatorio") {
        $.each(array, function(){
          total+=parseFloat(this) || 0;
        });
      }
      if (operacion === "b_producto") {
        total = 1;
        $.each(array, function(){
          total*=parseFloat(this) || 0;
        });
      }

      // mostramos el resultado en el lcd y reseteamos
      // los acumulados en caso de que hubieran
      $("#lcd").html(total);
      resetea_acumulado();
      setCaret(-1);
    });

});
