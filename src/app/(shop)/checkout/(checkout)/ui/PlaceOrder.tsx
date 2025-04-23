'use client'

import { placeOrder } from "@/actions"
import { useCartStore, userAddress } from "@/store"
import { currencyFormat } from "@/utils"
import clsx from "clsx"
import { useEffect, useState } from "react"

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = userAddress(state => state.address);
  const getSumaryInformation = useCartStore().getSumaryInformation();
  const { total, subTotal, tax, itemsInCart } = getSumaryInformation;

  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, [])

  if (!loaded) return <p>Loading...</p>

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const resp = await placeOrder(productsToOrder, address);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message as string);
      return;
    }
    //* Todo salió bien
    clearCart();
    window.location.href = `/orders/${resp.order?.id}`;
    // router.replace(`/orders/${resp.order?.id}`); //! Da error: Rendered more hooks than during the previous render.
  }

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl shadow-xl p-7">
      <div>
        <h2 className="text-2xl mb-2">Dirección de entrega</h2>
        <div>
          <p className="m-0 text-xl">{address.firstName} {address.lastName}</p>
          <p className="m-0">{address.address}</p>
          <p className="m-0">{address.address2}</p>
          <p className="m-0">{address.postalCode}</p>
          <p className="m-0">{address.city}, {address.country}</p>
          <p className="m-0">{address.phone}</p>
        </div>
      </div>

      <div className="w-full h-0.5 rounded my-4 bg-gray-200"></div>

      <h2 className="text-2xl mb-2 mt-0">Resumen del pedido</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">{itemsInCart === 1 ? '1 artículo' : `${itemsInCart} articulos`}</span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="text-2xl mt-8">Total</span>
        <span className="text-2xl mt-8 text-right">{currencyFormat(total)}</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Disclaimer */}
        <p className="text-xs mt-5 mb-10">
          Al hacer clic en &quotRealizar pedido&quot, aceptas nuestras <a href="#" className="underline">Condiciones de uso</a> y
          confirmas que has leído nuestra <a href="#" className="underline">Política de privacidad</a>, incluido el uso de cookies.
        </p>

        <button
          onClick={() => onPlaceOrder()}
          className={
            clsx({
              'btn-primary': !isPlacingOrder,
              'btn-primary-disabled': isPlacingOrder,
            })
          }
        >Realizar pedido</button>
        <span className="text-red-500 text-sm">{errorMessage}</span>
      </div>
    </div>
  )
}
