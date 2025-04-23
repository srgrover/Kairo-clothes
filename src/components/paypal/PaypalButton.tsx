'use client';

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions, OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
  orderId: string;
  ammount: number;
}

export const PaypalButton = ({ orderId, ammount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roudedAmmount = (Math.round(ammount * 100)) / 100;

  if (isPending)
    return (
      <div className="animate-pulse flex flex-col gap-4 mb-10">
        <div className="h-11 bg-gray-300 rounded"></div>
        <div className="h-11 bg-gray-300 rounded"></div>
      </div>
    )

  const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: roudedAmmount.toString(),
            currency_code: 'EUR'
          }
        }
      ],
      intent: "CAPTURE"
    });

    const { ok } = await setTransactionId(orderId, transactionId);
    if (!ok) throw new Error('No se pudo actualizar la orden');

    return transactionId;
  }

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();
    if (!details || !details.id) return;

    await paypalCheckPayment(details.id);
  }

  return (
    <div className="relative z-0">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </div>
  )
}
