import React from 'react';
import Layout from '../components/layouts/Layout'

import DetalleProducto from '../components/layouts/DetalleProducto';
import useProductos from '../hooks/useProductos';



export default function Populares() {

const {productos} = useProductos ('votos');

  return (
    <div>
      <Layout>
      <div className="listado-productos">
        <div className="contenedor">
          <ul className="bg-white">
            {productos.map(producto => (
                <DetalleProducto
                key={producto.id}
                producto={producto}
                />
            ))}
          </ul>
        </div>
      </div>
      </Layout>
    </div>
    
  )
}
