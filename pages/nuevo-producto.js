import React, { Fragment, useState, useContext } from 'react';
import Layout from '../components/layouts/Layout'
import { css } from '@emotion/core';
import { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';

import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
import { FirebaseContext } from '../firebase';
import Error404 from '../components/layouts/Error404'

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  // imagen: '',
  url: '',
  descripcion: ''
}

export default function NuevoProducto() {

  const [nombreImagen, setNombreImagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImagen, setUrlImagen] = useState('');

  const [error, setError] = useState(false);

  const {
    valores, errores, handleChange, handleSubmit
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  //Hooks de routing para redireccionar
  const router = useRouter();

  //Contex con las operaciones CRUD de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  async function crearProducto() {

    //Si el usuario no está autenticado
    if (!usuario) {
      return router.push('/login');
    }

    //Crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    }

    //Insertar en la base de datos
    firebase.db.collection('productos').add(producto);
    return router.push('/');
  }
  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };

  const handleProgress = progreso => {
    setProgreso({ progreso })
  };

  const handleUploadError = error => {
    setSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = nombreImagen => {
    setProgreso(100);
    setSubiendo(false);
    setNombreImagen(nombreImagen);

    firebase
      .storage
      .ref("productos")
      .child(nombreImagen)
      .getDownloadURL()
      .then(url => {
        setUrlImagen(url);
      });
  };




  return (
    <div>
      <Layout>
        {!usuario ? <Error404 /> :
          <Fragment>
            <h1
              css={css`
           text-align:center;
           margin-top: 5rem;
           `}
            >
              Nuevo Producto</h1>
            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >
              <fieldset>
                <legend>Informacion general</legend>
                {errores.nombre && <Error>{errores.nombre}</Error>}
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                  // onBlur={handleBlur}
                  />
                </Campo>
                {errores.empresa && <Error>{errores.empresa}</Error>}
                <Campo>
                  <label htmlFor="nombre">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Empresa o compañia"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                  // onBlur={handleBlur}
                  />
                </Campo>
                {errores.imagen && <Error>{errores.imagen}</Error>}
                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  // onBlur={handleBlur}
                  />
                </Campo>
                {errores.url && <Error>{errores.url}</Error>}
                <Campo>
                  <label htmlFor="url">Url</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    placeholder="URL de tu producto"
                    value={url}
                    onChange={handleChange}
                  // onBlur={handleBlur}
                  />
                </Campo>
              </fieldset>
              <fieldset>
                <legend>Sobre tu producto</legend>

                {errores.descripcion && <Error>{errores.descripcion}</Error>}
                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                  // onBlur={handleBlur}
                  />
                </Campo>
              </fieldset>
              <InputSubmit
                type="submit"
                value="Crear Producto"
              />
            </Formulario>
          </Fragment>
        }

      </Layout>
    </div>


  )
}


