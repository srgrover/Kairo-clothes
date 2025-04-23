import { getOrderById } from "@/actions/order/get-order-by-id";
import { PaidLabel, PaypalButton, Title } from "@/components";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

interface Props {
  params:
  Promise<{ id: string }>
}

export default async function OrdersById({ params }: Props) {
  const { id } = await params;
  //TODO: Verificar y redirect() si no hay pedido con ese id

  const { ok, order } = await getOrderById(id);

  if (!ok) redirect('/')

  const orderAddress = order?.OrderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">

      <div className="flex flex-col w-[1000px]">
        <Title title={`Pedido #${id.split('-').at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5 gap-4">
            <PaidLabel isPaid={order!.isPaid} />

            {/* Items */}
            {
              order?.OrderItem.map((item) => {
                return (
                  <div key={`${item.product?.slug}-${item.size}`} className="flex">
                    <Image src={`/products/${item.product?.ProductImage[0].url}`}
                      width={100} height={100} alt={item.product!.title}
                      className="mr-5 rounded" />
                    <div className="flex flex-col gap-2">
                      <p className="m-0">{item.product?.title}</p>
                      <p className="m-0">${item.price} x {item.quantity}</p>
                      <p className="m-0 font-bold">Subtotal: ${item.price * 3}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>

          {/* Checkout */}
          <div className="flex flex-col gap-4 bg-white rounded-xl shadow-xl p-7">
            <div>
              <h2 className="text-2xl mb-2">Dirección de entrega</h2>
              <div>
                <p className="m-0 text-xl">{orderAddress!.firstName} {orderAddress!.lastName}</p>
                <p className="m-0">{orderAddress!.address}</p>
                <p className="m-0">{orderAddress!.address2}</p>
                <p className="m-0">{orderAddress!.postalCode}</p>
                <p className="m-0">{orderAddress!.city}, {orderAddress!.countryId}</p>
                <p className="m-0">{orderAddress!.phone}</p>
              </div>
            </div>

            <div className="w-full h-0.5 rounded my-4 bg-gray-200"></div>

            <h2 className="text-2xl mb-2 mt-0">Resumen del pedido</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">{order?.itemInOrder === 1 ? '1 artículo' : `${order?.itemInOrder} articulos`}</span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subtotal)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="text-2xl mt-8">Total</span>
              <span className="text-2xl mt-8 text-right">{currencyFormat(order!.total)}</span>
            </div>

            <div>
              {
                order?.isPaid
                  ? <PaidLabel isPaid={order!.isPaid} />
                  : <PaypalButton ammount={order!.total} orderId={order!.id} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}