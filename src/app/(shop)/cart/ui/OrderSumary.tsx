'use client';

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react"


export const OrderSumary = () => {
  const [loaded, setLoaded] = useState(false);
  const getSumaryInformation = useCartStore().getSumaryInformation();
  const { total, subTotal, tax, itemsInCart } = getSumaryInformation;

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) return <p>Loading...</p>

  return (
    <div className="grid grid-cols-2">
      <span>No. Productos</span>
      <span className="text-right">{ itemsInCart === 1 ? '1 artículo' : `${ itemsInCart } articulos`}</span>

      <span>Subtotal</span>
      <span className="text-right">{ currencyFormat(subTotal) }</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{ currencyFormat(tax) }</span>

      <span className="text-2xl mt-8">Total</span>
      <span className="text-2xl mt-8 text-right">{ currencyFormat(total) }</span>
    </div>
  )
}
