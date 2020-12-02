export default function validarCrearProducto(valores) {
    let errores = {};

    //validar el nombre del usuario 
    if (!valores.nombre) {
        errores.nombre = "El nombre es obligatorio";
    }

   //Validar empresa
   if (!valores.empresa) {
    errores.empresa = "La empresa es obligatoria";
}

   //Validar url
   if (!valores.url) {
    errores.url = "La URL del producto es obligatoria";
}else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
    errores.url = "La URL no es válida";
}

   

   //validar descripción
   if (!valores.descripcion) {
    errores.descripcion = "La descripción es obligatoria";
}


    return errores;

}