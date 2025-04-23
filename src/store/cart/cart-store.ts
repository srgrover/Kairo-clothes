import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getTotalItems: () => number;
  getSumaryInformation: () => {
    total: number;
    subTotal: number;
    tax: number;
    itemsInCart: number;
  };

  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProductFromCart: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      clearCart: () => {
        set({ cart: [] });
      },
      
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        // 1. Revisar si el producto existe en el carrito con la talla seleccionada
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // 2. Se que el producto existe en el carrito con la talla seleccionada. Lo incremnentamos
        const updateCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }

          return item;
        });

        set({ cart: updateCartProducts });
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        const updateCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity };
          }

          return item;
        });

        set({ cart: updateCartProducts });
      },

      removeProductFromCart: (product: CartProduct) => {
        const { cart } = get();

        const updateCartProducts = cart.filter(
          (item) => !(item.id === product.id && item.size === product.size)
        );

        set({ cart: updateCartProducts });
      },

      getSumaryInformation: () => {
        const { cart } = get();
        const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
        const subTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const tax = subTotal * 0.15;
        const total = subTotal + tax;

        return {
          total,
          subTotal,
          tax,
          itemsInCart
        };
      },
    }),
    {
      name: "cart-store",
    }
  )
);
