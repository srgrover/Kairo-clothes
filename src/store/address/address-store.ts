import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  address: {
    firstName: string
    lastName: string
    address: string
    address2?: string
    postalCode: string
    city: string
    country: string 
    phone: string
    remember?: boolean
  };

  // Methods
  setAddress: (address: State["address"]) => void;
}

export const userAddress = create<State>()(
  //? Persist para guardar nuestro estado en el localStorage
  persist(
    //? Valores por defecto de nuestro estado de address
    (set) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
      },

      setAddress: (address) => set({ address }),
    }),
    {
      name: "address-store",
    }
  )
);
