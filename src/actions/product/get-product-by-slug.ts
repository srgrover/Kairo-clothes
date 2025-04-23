import prisma from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        ProductImage: true,
      },
    });

    if (!product) return null;
    return {
      ...product,
      images: product.ProductImage.map(image => image.url)
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener el producto por slug');
  }
};
