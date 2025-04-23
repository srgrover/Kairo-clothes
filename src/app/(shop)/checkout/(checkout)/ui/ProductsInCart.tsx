'use client';

import { useCartStore } from '@/store';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { currencyFormat } from '@/utils';
import { redirect } from 'next/navigation';

export const ProductsInCart = () => {
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
              <Image
                src={`/products/${product.image}`}
                width={100} 
                height={100} 
                alt={product.title} 
                className="rounded" />
              <div className='flex flex-col gap-2'>
                <span className='m-0 flex gap-1 items-center hover:underline'>
                  <p className='m-0'>{product.size} - {product.title} (x{ product.quantity }) </p>
                </span>
                <p className='m-0 font-bold'>{ currencyFormat(product.price * product.quantity) }</p>
              </div>
            </div>
          )
        })
      }
    </>
  )
}
