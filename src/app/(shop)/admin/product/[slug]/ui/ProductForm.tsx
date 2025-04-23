"use client";

import { createUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";
import { Product, Category, ProductImage as ProductWithImage } from "@/interfaces";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { IoTrashOutline } from "react-icons/io5";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[]};
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs  {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: 'men'|'women'|'kid'|'unisex';
  categoryId: string;

  images?: FileList; //? Se encarga de recibir las imagenes del formulario y enviarlas al servidor para guardarla
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();

  const {
    handleSubmit,             //? Se encarga de manejar el submit del formulario
    register,                 //? Se encarga de registrar los campos del formulario
    //formState,                //? Se encarga de validar los campos del formulario
    getValues,                //? Se encarga de obtener los valores de los campos del formulario
    setValue,                 //? Se encarga de establecer el valor de un campo del formulario
    watch                     //? Se encarga de observar los cambios en los campos del formulario para volver a pintar la vista
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],

      images: undefined,
    }
  });

  //? Se encarga de volver a pintar la vista cuando cambia el valor de sizes
  watch('sizes');

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();

    const { images, ...productToSave } = data;

    if(product.id){
      formData.append('id', product.id ?? '');
    }
    formData.append('title', productToSave.title);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append('categoryId', productToSave.categoryId);
    formData.append('gender', productToSave.gender);

    if( images ){
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const { ok, product: updatedProduct } = await createUpdateProduct(formData);

    if( !ok ) {
      alert('Error al guardar el producto');
      return;
    }

    router.replace(`/admin/product/${updatedProduct!.slug}`);
  };

  const onSizeChange = (size: string) => {
    const sizes = new Set(getValues('sizes'));
    if (sizes.has(size)) sizes.delete(size);
    else sizes.add(size);
    
    setValue('sizes', Array.from(sizes));  
  }

  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col">
          <span>Título</span>
          <input type="text" className="border border-neutral-300 p-2 rounded-md bg-gray-200" { ...register('title', { required: true }) } />
        </div>

        <div className="flex flex-col">
          <span>Slug</span>
          <input type="text" className="border border-neutral-300 p-2 rounded-md bg-gray-200" { ...register('slug', { required: true }) } />
        </div>

        <div className="flex flex-col">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="border border-neutral-300 p-2 rounded-md bg-gray-200"
            { ...register('description', { required: true }) }
          ></textarea>
        </div>

        <div className="flex flex-col">
          <span>Price</span>
          <input type="number" className="border border-neutral-300 p-2 rounded-md bg-gray-200" { ...register('price', { required: true, min: 0 }) } />
        </div>

        <div className="flex flex-col">
          <span>Tags</span>
          <input type="text" className="border border-neutral-300 p-2 rounded-md bg-gray-200" { ...register('tags', { required: true }) } />
        </div>

        <div className="flex flex-col">
          <span>Gender</span>
          <select className="border border-neutral-300 p-2 rounded-md bg-gray-200" { ...register('gender', { required: true }) }>
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col">
          <span>Categoria</span>
          <select className="border border-neutral-300 p-2 rounded-md bg-gray-200" { ...register('categoryId', { required: true }) }>
            <option value="">[Seleccione]</option>
            {
              categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            }
          </select>
        </div>

        <button className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full flex flex-col gap-5">
      <div className="flex flex-col">
          <span>Inventario</span>
          <input type="number" className="border border-neutral-300 p-2 rounded-md bg-gray-200" { ...register('inStock', { required: true, min: 0 }) } />
        </div>
        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {
              sizes.map(size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div 
                  key={size} 
                  onClick={() => onSizeChange(size)}
                  className={clsx(
                    'p-2 border rounded-md border-neutral-300 cursor-pointer mr-2 mb-2 transition-all text-center',
                    {
                      'bg-blue-500 text-white': getValues('sizes').includes(size)
                    }
                  )}>
                  <span>{size}</span>
                </div>
              ))
            }
          </div>
        </div>
        <div className="flex flex-col">
          <span>Fotos</span>
          <input
            { ...register('images') }
            type="file"
            multiple
            className="p-2 border rounded-md border-neutral-300 bg-gray-200"
            accept="image/png, image/jpeg, image/avif"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {
              product.ProductImage?.map((image) => (
                <div key={image.id} className="flex flex-col items-center">
                  <ProductImage
                    alt={ product.title ?? '' }
                    src={ image.url }
                    width={ 300 }
                    height={ 300 }
                    className="rounded-t-lg shadow-md w-full object-cover"
                  />

                  <button 
                    type="button" 
                    onClick={() => deleteProductImage( image.id, image.url )}
                    className="flex gap-1 items-center h-10 justify-center p-4 btn-danger w-full rounded-b-lg">
                    <IoTrashOutline />
                    Eliminar
                  </button>
                </div>
              ))
            }
        </div>
      </div>
    </form>
  );
};