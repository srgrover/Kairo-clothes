"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  const session = await auth();
  const userId = session?.user.id;

  // Verificar sesion de usuario
  if (!userId) {
    return {
      ok: false,
      message: "Debe iniciar sesión para realizar esta acción",
    };
  }

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { transactionId },
    });

    if(!order){
      return {
        ok: false,
        message: `No se encontró la orden con el id ${orderId}`, 
      }
    }

    return { ok: true };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: error,
    };
  }
};
