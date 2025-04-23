export const revalidate = 604800; // 7 dias

import { getProductBySlug } from "@/actions";
import { ProductMobileSlideShow, ProductSlideShow, StockLabel } from "@/components";
import { titleFont } from "@/config/fonts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddToCart";

interface Props {
  params: 
    Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // read route params
  const { slug } = await params
 
  // fetch data
  const product = await getProductBySlug(slug)
  
  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`],
    },
  }
}

export default async function ProductBySlugPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">

      <div className="col-span-1 md:col-span-2">
        {/* Mobile slideshow */}
        <ProductMobileSlideShow images={product.images} title={product.title} className="block md:hidden" />
        {/* Desktop SlideShow */}
        <ProductSlideShow images={product.images} title={product.title} className="hidden md:block" />
      </div>

      {/* Detalles del producto */}
      <div className="col-span-1 px-5">
        <StockLabel slug={slug} />
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5 mt-0">${product.price.toFixed(2)}</p>

        <AddToCart product={product} />

        {/* Descripcion */}
        <h3 className="font-bold text-sm mb-0">Descripcion</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}