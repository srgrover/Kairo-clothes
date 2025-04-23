'use server';

import prisma from "@/lib/prisma";

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({
      where: { userId: userId }
    })

    if (!address) return null;

    const {countryId, address2, ...rest} = address

    return {
      address2: address2 ?? '',
      country: countryId ?? undefined,
      ...rest,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}