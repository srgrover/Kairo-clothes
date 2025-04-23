"use server";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  // Verificar sesion de usuario
  if (!userId) {
    return {
      ok: false,
      message: "Debe iniciar sesión para realizar una orden",
    };
  }
  // Obtener la informacion de los productos
  // NOTA: Podemos seleccionar +2 productos con el mismo ID

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsIds.map((product) => product.productId),
      },
    },
  });

  // Calcular el total a pagar
  const itemsInOrder = productsIds.reduce(
    (count, product) => count + product.quantity,
    0
  );

  // Totales de tax, subtotal y total
  const { subTotal, tax, total } = productsIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);

      if (!product)
        throw new Error(`El producto ${item.productId} no existe - 500`);

      const subTotal = product.price * productQuantity;
      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  // Crear la tansaccion en bbdd
  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = productsIds.map((product) => {
        // Acumular los valores de la cantidad de productos que se van a actualizar
        const productQuantity = productsIds
          .filter((p) => p.productId === product.productId)
          .reduce((count, p) => count + p.quantity, 0);

        if (productQuantity === 0)
          throw new Error(
            `El producto ${product.productId} no tiene cantidad definida - 500`
          );
        return tx.product.update({
          where: {
            id: product.productId,
          },
          data: {
            //inStock: product.inStock - productQuantity // <- NO HACERLO DE ESTA MANERA
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Verificar valores negativos en el stock = no hay stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0)
          throw new Error(
            `El producto ${product.title} no tiene stock suficiente`
          );
      });

      // 2. Crear la orden - Encabezado - Detalle
      const order = await tx.order.create({
        data: {
          userId,
          itemInOrder: itemsInOrder,
          subtotal: subTotal,
          tax,
          total,

          OrderItem: {
            createMany: {
              data: productsIds.map((product) => ({
                quantity: product.quantity,
                size: product.size,
                productId: product.productId,
                price:
                  products.find((p) => p.id === product.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      // 3. Crear la dirección de la orden
      //Address
      const { country, ...restAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          firstName: restAddress.firstName,
          lastName: restAddress.lastName,
          address: restAddress.address,
          address2: restAddress.address2,
          postalCode: restAddress.postalCode,
          city: restAddress.city,
          phone: restAddress.phone,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        orden: order,
        orderAddress: orderAddress,
        updateProducts: updatedProducts,
      };
    });

    return {
      ok: true,
      order: prismaTransaction.orden,
      prismaTransaction: prismaTransaction,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: error,
    };
  }
};
