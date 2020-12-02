import React, { useEffect, useContext, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

import Layout from '../../components/layouts/Layout';
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layouts/Error404';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
    @media (min-width: 768px){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #da552f;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;



const Producto = () => {

    //State del componente
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarDB, setConsultarDB] = useState(true);


    //Routing para obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;

    // constext de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if (id && consultarDB) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if (producto.exists) {
                    setProducto(producto.data());
                    setConsultarDB(false);
                } else {
                    setError(true);
                    setConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id, consultarDB]);

    if (Object.keys(producto).length === 0 && !error) return 'Cargando...'

    const { comentarios, votos, creado, descripcion, empresa, nombre, url, urlImagen, creador, haVotado } = producto;

    //Administrar y validar los votos
    const votarProducto = () => {
        if (!usuario) {
            return router.push('/login')
        }

        //Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        //Verificar si el usuario actual ha votado
        if (haVotado.includes(usuario.uid)) return;

        //Guardar el id del usuarioa que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid];

        //Actualizar en la base de datos
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoHaVotado
        })

        //Actualizar el sate
        setProducto({
            ...producto,
            votos: nuevoTotal
        })

        setConsultarDB(true);
    }

    //Funciones para crear comentarios
    const handleChangeComentario = (e) => {
        setComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    //identifica si el comentario es del creador del producto
    const esCreador = id => {
        if (creador.id == id) {
            return true;
        }
    }


    const handleAgregarComentario = (e) => {
        e.preventDefault();

        if (!usuario) {
            return router.push('/login')
        }

        //Informacion extra al comentarios
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //Tomar copia de comentarios
        const nuevosComentarios = [...comentarios, comentario];

        //Actualizar la base de datos
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })

        //Actualizar el state
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        })
        setConsultarDB(true);
    }

    //Función que revisa que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () => {
        if(!usuario) {
            return false;
        }
        if (creador.id === usuario.uid) {
            return true
        }
    }

    //Eliminar u producto de la base de datos
    const handleClickEliminarProducto = async() => {

        if(!usuario) {
            return router.push('/login')
        }
        if (creador.id !== usuario.uid) {
            return router.push('/login')
        }
        try {
           await firebase.db.collection('productos').doc(id).delete();
           router.push('/')

            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <Fragment>
                {error ? <Error404 /> :
                    <div className="contenedor">
                        <h1
                            css={css`
                         text-align: center;
                         margin-top: 5rem;
                     `}
                        >
                            {nombre}
                        </h1>
                        <ContenedorProducto>
                            <div>
                                <p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })}</p>
                                <p>Por: {creador.nombre} de {empresa}</p>
                                <img src={urlImagen} />
                                <p>{descripcion}</p>
                                {usuario && (
                                    <Fragment>
                                        <h2>Agrega tu comentario</h2>
                                        <form
                                            onSubmit={handleAgregarComentario}
                                        >
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name="mensaje"
                                                    onChange={handleChangeComentario}
                                                />
                                            </Campo>
                                            <InputSubmit
                                                type="submit"
                                                value="Agregar comentario"
                                            />
                                        </form>
                                    </Fragment>
                                )}

                                <h2 css={css`margin: 2rem 0;`}>
                                    Comentarios
                         </h2>

                                {comentarios.length === 0 ? " Aún no hya comentarios. " :


                                    <ul>
                                        {comentarios.map((comentario, i) => (
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                 border: 1px solid #e1e1e1;
                                                 padding: 2rem;
                                             `}
                                            >


                                                <span css={css`
                                                 font-weight: bold;
                                             `}>
                                                    {comentario.usuarioNombre}{":"}
                                                </span>
                                                <p>{comentario.mensaje}</p>
                                                {esCreador(comentario.usuarioId) && <CreadorProducto>Es creador</CreadorProducto>}
                                            </li>
                                        ))}
                                    </ul>

                                }

                            </div>
                            <aside css={css`margin-top: 7.5rem;`}>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={url}

                                >
                                    visitar URL
                         </Boton>
                                <div css={css`margin-top: 5rem`}>
                                    <p css={css`
                             text-align: center;
                         `}
                                    >{votos} Votos</p>
                                    {usuario && (
                                        <Boton
                                            onClick={votarProducto}
                                        >
                                            Votar
                                        </Boton>
                                    )}

                                </div>

                            </aside>
                        </ContenedorProducto>
                        {puedeBorrar() && 
                        <Boton
                        onClick={handleClickEliminarProducto}
                        >Eliminar Producto</Boton>}
                    </div>
                }

            </Fragment>
        </Layout>
    );
}

export default Producto;