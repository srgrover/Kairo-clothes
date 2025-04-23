"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();

  // Verificar sesion de usuario
  if (!session?.user) {
    return {
      ok: false,
      message: "Debe iniciar sesión para realizar una orden",
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                price: true,
                slug: true,
                
                ProductImage: {
                  select: {
                    url: true, 
                  },
                  take: 1,
                }
              },
            }
          }
        },
      },
    });

    // Verificar si la orden existe
    if (!order)  throw new Error("No se encontró la orden");

    // Verificar si el usuario es el dueño de la orden o es admin
    if(session.user.role === 'user') {
      if (session.user.id !== order.userId) 
        throw new Error("Esta orden no pertenece a su usuario o no tiene permisos para verla.");
    };

    return {
      ok: true,
      order: order,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al obtener la orden. La orden no existe o no tiene permisos para verla",
    };
  }
};
