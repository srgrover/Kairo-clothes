
// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductImage, Title } from '@/components';
import { currencyFormat } from '@/utils';

import Link from 'next/link';

interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>
}
export default async function ProductsMaintenancePage({ searchParams }: Props) {

  const page = (await searchParams).page ? Number((await searchParams).page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({ page });
  
  return (
    <>
      <Title title="Mantenimiento de productos" />
      <div className='flex justify-end mb-5'>
       <Link href={'/admin/product/new'} className='btn-primary'>Nuevo producto</Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Imagen
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Titulo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Precio
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Género
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Stock
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Sizes
              </th>
            </tr>
          </thead>
          <tbody>
          {
            products.map((product) => (
              <tr key={product.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link href={`/product/${product.slug}`}>
                    <ProductImage
                      src={ product.ProductImage[0]?.url }
                      width={ 80 }
                      height={ 80 }
                      alt={ product.title }
                      className='rounded w-20 h-20 object-cover' />
                  </Link>
               </td>

                <td className="flex items-center! text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link href={`/admin/product/${product.slug}`} className='hover:underline'>
                    {product.title}
                  </Link>
                </td>
                <td className="text-sm text-gray-900 font-bold px-6 ">
                  {currencyFormat(product.price)}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 ">
                  {product.gender}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 ">
                  {product.inStock}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 ">
                  {product.sizes?.join(', ')}
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
        <Pagination totalPages={ totalPages } />
      </div>
    </>
  );
}