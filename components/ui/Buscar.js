import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Router from 'next/router';

const InpuctText = styled.input`
    border: 1px solid var(--gris3);
    padding: 1rem;
    min-width: 300px;
`;

const ButtonSubmit = styled.button`
height: 3rem;
width: 3rem;
display: block;
background-size: 4rem;
background-repeat: no-repeat;
position: absolute;
right: 1rem;
top: 1px;
background-color: white;
border: none;
outline: none;
text-indent: -9999px;
background-image: url('/static/img/buscar.png');

&:hover {
    cursor: pointer;
}

`;

const Buscar = () => {

    const [busqueda, setBusqueda] = useState('');

    const handleSubmitBusqueda = (e) => {
        e.preventDefault();

        if (busqueda.trim() === '') return;



        //Redireccionar al usuario a /buscar
        Router.push({
            pathname: '/buscar',
            query: { q: busqueda }
        })
    }

    return (
        <form
            css={css`
                position: relative;
        `}
            onSubmit={handleSubmitBusqueda}
        >
            <InpuctText
                type="text"
                placeholder="Buscar productos"
                onChange={e => setBusqueda(e.target.value)}
            />
            <ButtonSubmit type="submit" ></ButtonSubmit>
        </form>
    );
}

export default Buscar;