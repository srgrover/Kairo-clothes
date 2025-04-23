export const revalidate = 60; // 60 segundos

import { Pagination, Title } from "@/components";
import { ProductGrid } from '../../components/products/product-grid/ProductGrid';
import { getPaginatedProductsWithImages } from "@/actions";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ 
    [key: string]: string | string[] | undefined;
  }>
}

export default async function Home({ searchParams }: Props) {
  const page = (await searchParams).page ? Number((await searchParams).page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({ page });

  if ( products.length === 0 ) redirect('/');

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
