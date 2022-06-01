//Create, Read, Update y Delete para las categorias o rubros
//sistete

//Crear un nuevo registro en la base de datos rubro o categoria
let idEliminar=0;
let idActualizar=0;

function actionCreate() {
    //alert("Tu estas intentando crear una categoria en la base de datos");
    let nombreCategoria    = document.getElementById("nombre_rubro").value;
    let tieneSubcategorias = $('#radio_categoria_si').is(":checked"); //true o false 
    let Descripcion        = "No tiene subtemas";
    
    if( tieneSubcategorias)
      Descripcion = "Si tiene subtemas";
         
    //Vamos a comunicarnos con el PHP
    //$ = JQuery
    //Metodo por default de enviar parametros es GET
    $.ajax({ 
        method:"POST",
        url: "plantilla/phppropios/crud-categorias.php",
        data: {
          categoria : nombreCategoria,
          subcategorias : tieneSubcategorias,//true o false
          accion : "create"
        },
        success: function( respuesta ) {
          //console.log(respuesta);

          JSONRespuesta = JSON.parse(respuesta); 
          if(JSONRespuesta.estado==1){
            //Agregar el registro a la tabla 
            tabla = $("#example1").DataTable();
            //let Botones = "Botones";
            let Botones ='<a class="btn btn-warning btn-sm" data-toggle="modal" data-target="#modal-lg-subtemas" href="#" ><i class="fas fa-clock"></i></a>';
                Botones +=' <a class="btn btn-primary btn-sm" href="#" data-toggle="modal" data-target="#modal-update" onclick="identificarActualizar('+JSONRespuesta.id+')"><i class="fas fa-edit"></i></a>';
                Botones +=' <a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#modal-delete" onclick="identificarEliminar('+JSONRespuesta.id+')"><i class="fas fa-trash"></i></a>';
            tabla.row.add([nombreCategoria,Descripcion,Botones]).draw().node().id="renglon_"+JSONRespuesta.id;

            toastr.success(JSONRespuesta.mensaje);
          }else{
            toastr.error(JSONRespuesta.mensaje);
          }
        }
    });
}

//Para leer todos los registros de la tabla rubro o categoria
function actionRead() {
  $.ajax({
    method:"POST",
    url: "plantilla/phppropios/crud-categorias.php",
    data: {
      accion: "read"
    },
    success: function( respuesta ) {
      
      JSONRespuesta = JSON.parse(respuesta);
      
      if(JSONRespuesta.estado==1){
        //Mostrar los registros = categorias en la tabla
        tabla = $("#example1").DataTable();

             //Ciclo for para leer la categoria del arreglo
            JSONRespuesta.categorias.forEach(categoria => {
              let Botones ='<a class="btn btn-warning btn-sm" data-toggle="modal" data-target="#modal-lg-subtemas" href="#" ><i class="fas fa-clock"></i></a>';
              Botones +=' <a class="btn btn-primary btn-sm" href="#" data-toggle="modal" data-target="#modal-update" onclick="identificarActualizar('+categoria.id+')"><i class="fas fa-edit"></i></a>';
              Botones +=' <a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#modal-delete" onclick="identificarEliminar('+categoria.id+')"><i class="fas fa-trash"></i></a>';
           
              if(categoria.subcategoria==1)
                etiquetaSubcategoria ="Si tiene subtemas";
              else
                etiquetaSubcategoria = "No tiene subtemas";
              tabla.row.add([categoria.nombrecategoria,
                             etiquetaSubcategoria,
                             Botones]).draw().node().id="renglon_"+categoria.id;

            });

      } 
      //console.log(respuesta);
      //Mostrar todos los registros en la tabla
    }
  });
}

//Actualizar un registro de la tabla rubro o categoria
function actionUpdate(){
  //accion = update
  let nombreCategoria    = document.getElementById("nombre_rubro_actualizar").value;
  let tieneSubcategorias = $('#radio_categoria_si_actualizar').is(":checked");  
  let Descripcion        = "No tiene subtemas";
    
  if( tieneSubcategorias)
      Descripcion = "Si tiene subtemas";

  $.ajax({
    method:"POST",
    url: "plantilla/phppropios/crud-categorias.php",
    data: {
      id            : idActualizar,
      categoria     : nombreCategoria,
      subcategorias : tieneSubcategorias,//true o false
      accion        : "update"
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);
      if(JSONRespuesta.estado==1){
        //Debemos actualizar el renglon de la tabla
        let tabla = $("#example1").DataTable();
        
        ////////////////////////////////////////////////
        var temp = tabla.row("#renglon_"+idActualizar).data();
        //Nombre
        temp[0] = nombreCategoria;
        //Descripcion
        temp[1] = Descripcion;
        tabla.row("#renglon_"+idActualizar).data(temp).draw();
        /////////////////////////////////////////////////

        toastr.success(JSONRespuesta.mensaje);
      }else{
        toastr.error(JSONRespuesta.mensaje);
      }
    }
  });
}

//Para eliminar un registro de la tabla rubro o categoria
function actionDelete() {
  //accion = update    
  //alert("Vas a eliminar al registro "+idEliminar);
  $.ajax({
    method:"POST",
    url: "plantilla/phppropios/crud-categorias.php",
    data: {
      id: idEliminar,
      accion:"delete"
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);
      if(JSONRespuesta.estado==1){
        let tabla = $("#example1").DataTable();
        //Eliminar un renglon del DataTable
        tabla.row("#renglon_"+idEliminar).remove().draw();
        toastr.success(JSONRespuesta.mensaje);
      }else{
        toastr.error(JSONRespuesta.mensaje);
      }
    }
  });
}

function identificarEliminar(id){
  idEliminar=id;
}

function identificarActualizar(id){
  idActualizar=id;
  //Es necesario conectar con el servidor para traer los datos y mostrarlos
  //en la ventana modal de Actualizar
  //Es un solo registro y le mando el id para hacer la consulta en el servidor
  $.ajax({
    method:"POST",
    url: "plantilla/phppropios/crud-categorias.php",
    data: {
      id: idActualizar,
      accion:"read_id"
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);
      if(JSONRespuesta.estado==1){
        //Mostramos los datos en la ventana Modal
        let nombreRubro = document.getElementById("nombre_rubro_actualizar");
        //Mostrar el nombre del rubro
        nombreRubro.value=JSONRespuesta.nombrecategoria;
        if(JSONRespuesta.subcategoria==1){
          $('#radio_categoria_si_actualizar').prop('checked', true);
        }
        else{
          $('#radio_categoria_no_actualizar').prop('checked', true);
        }  
      }else{
        toastr.error("Registro no encontrado");
      }
    }
  });
}