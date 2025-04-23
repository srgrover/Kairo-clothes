'use client';

import { SizeSelector, QuantitySelector } from "@/components"
import { useState } from "react";
import { useCartStore } from "@/store";
import { CartProduct, Product, Size } from "@/interfaces";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductsToCart = useCartStore((state) => state.addProductToCart);

  const [size, setSize] = useState<Size|undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState<boolean>(false);

  const addToCart = () => {
    setPosted(true);
    if(size === undefined) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
    }

    addProductsToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  }

  return (
    <>
      {
        posted && !size &&
          <span className="text-red-600 text-sm fade-in">Debe seleccionar una talla*</span>
      }
      
      {/* Selector de tallas */}
      <SizeSelector 
        selectedSize={ size } 
        availableSizes={ product.sizes } 
        onSizeChanged={ setSize }
      />

      {/* Selector de cantidad */}
      <QuantitySelector quantity={ quantity } onQuantityChanged={ setQuantity } />

      {/* Boton agregar al carrito */}
      <button 
        onClick={ addToCart }
        className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  )
}
