import { initialData } from "./seed";
import prisma from '../lib/prisma';
import { countries } from "./seed-countries";

// Inserción de datos de prueba en nuestra base de datos
async function main() {
  try {
    // 1. Borrar registros previos
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    
    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();
    
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  
    const { categories, products, users } = initialData;

    // 1.1 Insertar usuarios
    await prisma.user.createMany({
      data: users
    });
  
    // 2. Insertar categorias
    const categoryData = categories.map( (name) => ({ name }));
    await prisma.category.createMany({
      data: categoryData
    });
  
    const categoriesDB = await prisma.category.findMany();
  
    const categoriesMap = categoriesDB.reduce( (map, category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    }, {} as Record<string, string>); // < string <- Texto (Shirt), string <- Id (categoryID)>
  
    // 3. Insertar productos
    products.forEach( async (product) => {
      const { images, type, ...rest } = product;
      const productDB = await prisma.product.create({
        data: {
          ...rest,
          categoryId: categoriesMap[type],
        }
      });
  
      // 4. Insertar imágenes
      const imagesDb = images.map( (image) => ({
        url: image,
        productId: productDB.id
      }));
      await prisma.productImage.createMany({
        data: imagesDb
      });
    });

    // 5 Insertar paises
    await prisma.country.createMany({
      data: countries
    });
  
    console.log('Seed ejecutado correctamente!')
  }
  catch (error) {
    console.log('Error al ejecutar el seed',error);
    return;
  }
}

(() => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();
