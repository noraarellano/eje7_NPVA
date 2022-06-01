<?php
    
    include 'conexion.php';

    $Respuesta = array();
    $accion    = $_POST['accion'];

    switch ($accion) {
        case 'create':
            actionCreatePHP($conexion);
            break;
        case 'update':
            actionUpdatePHP($conexion);
            break;
        case 'delete':
            actionDeletePHP($conexion);
            break;
        case 'read':
            actionReadPHP($conexion);
            break;
        case 'read_id':
            actionReadByIdPHP($conexion);
            break;
        default:
            # code...
            break;
    }

    function actionReadByIdPHP($conexion){
        $id                  = $_POST['id'];
        $queryReadById       = "SELECT * FROM categoria WHERE id=".$id;
        $resultById          = mysqli_query($conexion,$queryReadById);
        $numeroRegistrosById = mysqli_num_rows($resultById);
        if($numeroRegistrosById>0){
            $Respuesta['estado']  = 1;
            $Respuesta['mensaje'] = "Registro encontrado";
            
            $RenglonCategoriaById = mysqli_fetch_assoc($resultById);

            $Respuesta['id']                = $RenglonCategoriaById['id'];
            $Respuesta['nombrecategoria']   = $RenglonCategoriaById['nombrecategoria'];
            $Respuesta['subcategoria']      = $RenglonCategoriaById['subcategoria'];
        }else{
            $Respuesta['estado']            = 0;
            $Respuesta['mensaje']           = "No se encuentra el registro";
        }
        echo json_encode($Respuesta);
        mysqli_close($conexion);
    }

    function actionReadPHP($conexion){
        $QueryRead       = "SELECT * FROM categoria";
        $ResultadoRead   = mysqli_query($conexion,$QueryRead);
        $numeroRegistros = mysqli_num_rows($ResultadoRead);
        if($numeroRegistros>0){
            $Respuesta['estado']     = 1;
            $Respuesta['mensaje']    = "Los registro se listan correctamente";    
            $Respuesta['categorias'] = array();
            while ($RenglonCategoria = mysqli_fetch_assoc($ResultadoRead)) {
               $Categoria        = array();
               $Categoria['id']  = $RenglonCategoria['id'];
               $Categoria['nombrecategoria'] = $RenglonCategoria['nombrecategoria'];
               $Categoria['subcategoria']    = $RenglonCategoria['subcategoria'];
               //Cada categoria la agrega al arreglo categorias
               array_push($Respuesta['categorias'],$Categoria);
            }
        }else{
            $Respuesta['estado'] =0;
            $Respuesta['mensaje']="Los siento, pero na hay registros para mostrar";    
        }
        echo json_encode($Respuesta);
        mysqli_close($conexion); 
    }

    function actionDeletePHP($conexion){
        $id            = $_POST['id'];
        $queryEliminar = "DELETE FROM categoria WHERE id=".$id;
        mysqli_query($conexion,$queryEliminar);
        if(mysqli_affected_rows($conexion)>0) //Cuantos renglones se eliminaron
        {
            $Respuesta['estado']  = 1;
            $Respuesta['mensaje'] = "El registro se elimino correctamente";
        }else{
            $Respuesta['estado']  = 0;
            $Respuesta['mensaje'] = "Ocurrio un error desconcido";
        }
        echo json_encode($Respuesta);
        mysqli_close($conexion);
    }

    function actionCreatePHP($conexion){
        $categoria    = $_POST['categoria'];
        $subcategoria = $_POST['subcategorias'];
       
        //Consulta para crear una Categoria o Rubro
        $QueryCreate= "INSERT INTO categoria (id, nombrecategoria,subcategoria) 
        VALUES (
        NULL, 
        '".$categoria."',
        ".$subcategoria.")";
        //echo $QueryCreate;
        //if(1==1){
        if(mysqli_query($conexion,$QueryCreate)){
            $Respuesta['estado'] =1;
            $Respuesta['mensaje']="El registro se guardo correctamente";
            //$Respuesta['id']     =5;
            $Respuesta['id']     =mysqli_insert_id($conexion);
        }else{
            $Respuesta['estado'] =0;
            $Respuesta['mensaje']="Ocurrio un error desconocido";
            $Respuesta['id']     =-1;
        } 
        //Generar la consulta para agregar
        echo json_encode($Respuesta);
        mysqli_close($conexion);
    }
    
    function actionUpdatePHP($conexion){
        $id            = $_POST['id'];
        $categoria     = $_POST['categoria'];
        $subcategorias = $_POST['subcategorias'];

        $queryUpdate   = "UPDATE categoria SET 
                         nombrecategoria='".$categoria."', 
                         subcategoria=".$subcategorias." 
                         WHERE id=".$id;

        mysqli_query($conexion,$queryUpdate);

        if(mysqli_affected_rows($conexion)>0){//Cuantos renglones son afectados
            $Respuesta['estado'] =1;
            $Respuesta['mensaje']="El registro se actualizo correctamente";
        }else{
            $Respuesta['estado'] =0;
            $Respuesta['mensaje']="Ocurrio un error desconocido";
        }
        
        echo json_encode($Respuesta);
        mysqli_close($conexion);
    }
?>