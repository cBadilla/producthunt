import React, { Fragment, useState } from 'react';
import Layout from '../components/layouts/Layout'
import { css } from '@emotion/core';
import Router from 'next/router';

import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import useValidacion from '../hooks/useValidacion';

import validarCrearCuenta from '../validacion/validarCrearCuentas';

import firebase from '../firebase';

const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
}

export default function CrearCuenta() {

 const [error, setError] = useState(false);

  const {
    valores, errores, handleChange, handleSubmit
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;

  async function crearCuenta() {

    try {
      await firebase.registrarUsuario(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.log('Hubo un error ', error.message);
      setError(error.message);
    }

  }

  return (
    <div>
      <Layout>
        <Fragment>
          <h1
            css={css`
          text-align:center;
          margin-top: 5rem;
          `}
          >
            Crear cuenta</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
             {error && <Error>{error}</Error>}
            {errores.nombre && <Error>{errores.nombre}</Error>}
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu Nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
              // onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Tu Email"
                name="email"
                value={email}
                onChange={handleChange}
              // onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            <Campo>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Tu contraseña"
                name="password"
                value={password}
                onChange={handleChange}
              // onBlur={handleBlur}
              />
            </Campo>
            <InputSubmit
              type="submit"
              value="Crear Cuenta"
            />
          </Formulario>
        </Fragment>
      </Layout>
    </div>


  )
}
