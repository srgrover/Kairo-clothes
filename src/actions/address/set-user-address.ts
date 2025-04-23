"use server";

import { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      address: newAddress,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "No se pudo guardar la dirección",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storeAddress = await prisma.userAddress.findFirst({
      where: { userId },
    });

    const addresToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2,
      city: address.city,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
      countryId: address.country,
    };

    if (!storeAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addresToSave,
      });

      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addresToSave,
    });

    return updatedAddress;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo guardar la dirección");
  }
};
