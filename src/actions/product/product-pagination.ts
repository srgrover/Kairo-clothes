'use server';

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({ page = 1, take = 12, gender }: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if ( page < 1 ) page = 1;

  try {
    // 1. Obtener los productos
    const products = await prisma.product.findMany({
      take: 12,
      skip: ( page - 1 ) * take,
      where: {
        gender: gender,
      },
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          }
        },
      }
    });

    // 2. Obtener el total de paginas
    const totalCount = await prisma.product.count({
      where: {
        gender: gender,
      }
    });
    const totalPages = Math.ceil(Number(totalCount) / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map(product => ({
        ...product,
        images: product.ProductImage.map(image => image.url)
      }))
    }

  } catch (err) {
    throw new Error('Error fetching products: ' + err);
  }
}