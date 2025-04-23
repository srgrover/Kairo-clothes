'use client';

import { Product } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
    product: Product;
}

export const ProductGridItem = ({ product }: Props) => {

    const [displayImage, setdisplayImage] = useState(product.images[0])

    return (
        <div className='rounded-md overflow-hidden fade-in'>
            <Link href={`/product/${product.slug}`}>
                <Image 
                    onMouseEnter={() => setdisplayImage(product.images[1])} 
                    onMouseLeave={() => setdisplayImage(product.images[0])} 
                    src={`/products/${ displayImage }`}
                    alt={ product.title }
                    className='w-full object-cover object-center rounded-md h-auto'
                    width={500}
                    height={500}
                />
            </Link>

            <div className='py-4 flex flex-col'>
                <Link href={`/product/${product.slug}`} className='hover:text-blue-600'>
                    { product.title }
                </Link>
                <span className='font-bold'>${ product.price }</span>
            </div>
        </div>
    )
}
