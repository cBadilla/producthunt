import React, { Fragment, useState } from 'react';
import Layout from '../components/layouts/Layout'
import { css } from '@emotion/core';
import Router from 'next/router';

import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import useValidacion from '../hooks/useValidacion';

import validarLogin from '../validacion/validarLogin';

import firebase from '../firebase';

const STATE_INICIAL = {
  email: '',
  password: ''
}

export default function Login() {
  const [error, setError] = useState(false);

  const {
    valores, errores, handleChange, handleSubmit
  } = useValidacion(STATE_INICIAL, validarLogin, iniciarSesion);

  const { email, password } = valores;

async function iniciarSesion() {
  try {
    await firebase.login(email, password);
    Router.push('/');
  } catch (error) {
    setError(error.message)
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
            Iniciar Sesión</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
            {error && <Error>{error}</Error>}
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
              value="Inciar Sesión"
            />
          </Formulario>
        </Fragment>
      </Layout>
    </div>


  )
}
