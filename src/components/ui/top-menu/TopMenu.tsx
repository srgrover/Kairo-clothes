'use client'

import { titleFont } from '@/config/fonts'
import { useCartStore, useUiStore } from '@/store';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { IoSearchOutline, IoCartOutline } from 'react-icons/io5'

export const TopMenu = () => {
    const openMenu = useUiStore(state => state.openSideMenu);
    const totalItemsInCart = useCartStore(state => state.getTotalItems() );

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, [])
    
    return (
        <nav className='w-full'>
            <div className='flex justify-between items-center px-5'>
                <div>
                    <Link href="/">
                        <span className={`${titleFont.className} antialiased font-bold`}>
                            Teslo
                        </span>
                        <span> | Shop</span>
                    </Link>
                </div>

                <div className='hidden sm:block'>
                    <Link className='m-2 p-2 rounded-md tracking-all decoration-0 hover:bg-gray-100' href={'/gender/men'}>Hombres</Link>
                    <Link className='m-2 p-2 rounded-md tracking-all decoration-0 hover:bg-gray-100' href={'/gender/women'}>Mujeres</Link>
                    <Link className='m-2 p-2 rounded-md tracking-all decoration-0 hover:bg-gray-100' href={'/gender/kid'}>Niños</Link>
                </div>

                <div className='flex items-center'>
                    <Link href={'/search'} className='mx-2'>
                        <IoSearchOutline />
                    </Link>
                    <Link href={(totalItemsInCart === 0 && loaded) ? '/empty' : '/cart'} className='mx-2'>
                        <div className='relative'>
                            {
                                (loaded && totalItemsInCart > 0) &&
                                (<span className='fade-in absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white'>
                                    { totalItemsInCart }
                                </span>)
                            }
                            <IoCartOutline className='w-5 h-5' />
                        </div>
                    </Link>
                    <button onClick={ () => openMenu() } className='m-2 p-2 rounded-md transition-all bg-transparent cursor-pointer border-0 hover:bg-gray-100'>Menu</button>
                </div>
            </div>
        </nav>
    )
}
