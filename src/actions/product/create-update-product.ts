'use server';

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(255),
  slug: z.string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0, { message: 'Price must be at least 0' })
    .transform(val => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0, { message: 'Price must be at least 0' })
    .transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    console.error(productParsed.error)
    return { ok: false }
  }
  
  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replaceAll(/ /g, '-').trim();

  const {id, ...rest} = product;
  try {
    const pristmaTx = await prisma.$transaction(async (tx) => {
      let product: Product
      const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());
  
      if(id){   //update
        product = await tx.product.update({
          where: { id: id },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray
            }
          }
        }) as Product;
      } else {  //create
        product = await prisma.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: tagsArray
            }
          }
        });
      }

      // Proceso de carga y guardado de imagenes
      // Recorrer cada una de las imagenes y guardarlas en la base de datos
      if( formData.getAll('images') ){
        const images = await uploadImages(formData.getAll('images') as File[]);

        if( !images ){
          throw new Error('Error al subir las imagenes. Rollback');
        }

        await prisma.productImage.createMany({
          data: images.map(image => ({
            url: image!,
            productId: product.id
          }))
        })
      }

      return{
        product
      }
    });

    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/products/${ product.slug }`);
    revalidatePath(`/products/${ product.slug }`);

    return {
      ok: true,
      product: pristmaTx.product
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error. Revisa los logs para tener mas información'
    }
  }
}


const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (file) => {
      try {
        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        return cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`)
          .then( r => r.secure_url )
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    const upLoadedImages = await Promise.all(uploadPromises);
    return upLoadedImages;
  } catch (error) {
    console.error(error);
    return null;
  }
}