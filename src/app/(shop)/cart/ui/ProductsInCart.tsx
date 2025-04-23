'use client';

import { ProductImage, QuantitySelector } from '@/components'
import { useCartStore } from '@/store';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { currencyFormat } from '@/utils';
import { redirect } from 'next/navigation';

export const ProductsInCart = () => {
  const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
  const removeProductFromCart = useCartStore(state => state.removeProductFromCart);

  const [loaded, setLoaded] = useState(false)
  const productsInCart = useCartStore(state => state.cart);
  if(productsInCart.length === 0) redirect('/empty');
  
  useEffect(() => {
    setLoaded(true)
  }, []);

  if (!loaded) {
    return <p>Loading...</p>
  }


  return (
    <>
      {
        productsInCart.map((product) => {
          return (
            <div key={`${product.slug}${product.size}`} className="flex w-full gap-4">
              <ProductImage
                src={ product.image }
                width={ 100 } 
                height={ 100 } 
                style={{
                  width: '100px',
                  height: '100px',
                }}
                alt={ product.title } 
                className="rounded object-cover" />
              <div className='flex flex-col gap-2'>
                <Link href={`/product/${product.slug}`} className='m-0 flex gap-1 items-center hover:underline cursor-pointer'>
                  <p className='m-0'>{product.title}</p>
                </Link>
                <p className='m-0 text-xs font-light'>Talla: {product.size}</p>
                <p className='m-0'>{currencyFormat(product.price)}</p>

                <div className='flex flex-row items-center gap-10'>
                  <QuantitySelector quantity={ product.quantity } onQuantityChanged={ (value) => updateProductQuantity(product, value) } />

                  <button onClick={() => removeProductFromCart(product)} className="underline bg-transparent border-0">Eliminar</button>
                </div>

              </div>
            </div>
          )
        })
      }
    </>
  )
}
