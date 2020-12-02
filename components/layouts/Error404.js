import React from 'react';
import { css } from '@emotion/core';

const Error404 = () => {
    return ( 
        <h1
        css={css`
            margin-top: 5rem;
            text-align: center;
        `}
        >No es posible mostrar la información</h1>
     );
}
 
export default Error404;