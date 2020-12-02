export default function validarCrearCuenta(valores) {
    let errores = {};

    //validar el nombre del usuario 
    if (!valores.nombre) {
        errores.nombre = "El nombre es obligatorio";
    }

    //validar el email del usuario 
    if (!valores.email) {
        errores.email = "El email es obligatorio";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email = "Emial no válido";
    }

    //Validar el password
    if (!valores.password) {
        errores.password = "La contraseña es obligatoria"
    } else if (valores.password.length < 6) {
        errores.password = 'La contraseña debe de ser al menosde 6 caracteres';
    }

    return errores;

}