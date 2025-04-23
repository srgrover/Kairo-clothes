export const revalidate = 60; // 60 segundos

import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { getPaginatedProductsWithImages } from "@/actions";
import { redirect } from "next/navigation";

interface Props {
  params: 
    Promise<{ gender: string }>
  searchParams: Promise<{ 
    [key: string]: string | string[] | undefined;
  }>
}

export default async function GenderByType({ params, searchParams }: Props) {
  //! La consola de desarrollo me marca error si no pongo await en los params y searchParams
  const pageParams = await searchParams;
  const page = pageParams.page ? Number(pageParams.page) : 1;
  const { gender } = await params;
  const { products, totalPages } = await getPaginatedProductsWithImages({ page, gender: gender as Gender });

  if(products.length === 0) redirect(`/gender/${gender}`);

  const labels: Record<string, string> = {
    'men': 'para Hombres',
    'women': 'para Mujeres',
    'kid': 'para Niños',
    'unisex': 'para todos',
  }

  //if(id === 'kids') return notFound();

  return (
    <>
        <Title title={`Artículos ${(labels)[gender]}`} subtitle={'Todos los productos'} className="mb-2" />
        <ProductGrid products={ products } />
        <Pagination totalPages={ totalPages } />
      </>
  );
}