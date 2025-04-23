'use client';

import { logout } from "@/actions";
import { useUiStore } from "@/store";
import clsx from "clsx";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"

export const Sidebar = () => {

    const isSidebarOpen = useUiStore(state => state.isSideMenuOpen);
    const closeMenu = useUiStore(state => state.closeSideMenu);

    const {data: session} = useSession();
    const isAuthenticated = !!session?.user;
    const isAdmin = session?.user.role === 'admin';

    return (
        <div>
            {/* Background Black */}
            {
                isSidebarOpen && (
                    <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30 transition-all"></div>
                )
            }

            {/* Blur */}
            {
                isSidebarOpen && (
                    <div
                        onClick={() => closeMenu()}  
                        className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"></div>
                )
            }

            {/* Side Menu */}
            <nav
                className={
                    clsx(
                        "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                        {
                            "translate-x-full": !isSidebarOpen,
                        }
                    )
                }>
                <IoCloseOutline
                    size={50}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={ () => closeMenu() }
                />

                {/* Input busqueda */}
                <div className="relative mt-14">
                    <IoSearchOutline size={20} className="absolute top-2 left-2" />
                    <input type="text" placeholder="Buscar" className="w-full bg-gray-50 rounded pl-10 py-1 border-b-2 text-xl border-0 border-gray-200 focus:outline-none focus:border-blue-500" />
                </div>

                <div className="flex mt-5 flex-col gap-4">
                    {
                        isAuthenticated && (
                            <>
                                <Link href={'/profile'} onClick={ () => closeMenu() }
                                    className="flex gap-2 items-center p-2 hover:bg-gray-100 rounded transition-all"
                                >
                                    <IoPersonOutline size={20} />
                                    <span className="tex-xl">Perfil</span>
                                </Link>
                                <Link href={'/orders'} onClick={ () => closeMenu() }
                                    className="flex gap-2 items-center p-2 hover:bg-gray-100 rounded transition-all"
                                >
                                    <IoTicketOutline size={20} />
                                    <span className="tex-xl">Ordenes</span>
                                </Link>
                            </>
                        )
                    }

                    {
                        isAuthenticated 
                        ? (
                            <button onClick={ () => logout() }
                                className="flex w-full border-0 bg-transparent gap-2 items-center p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoLogOutOutline size={20} />
                                <span className="tex-xl">Salir</span>
                            </button>
                        )
                        : (
                            <Link href={'/auth/login'} onClick={ () => closeMenu() }
                                className="flex gap-2 items-center p-2 hover:bg-gray-100 rounded transition-all"
                            >
                                <IoLogInOutline size={20} />
                                <span className="tex-xl">Ingresar</span>
                            </Link>
                        )
                    }


                    {
                        isAuthenticated && isAdmin && (
                            <>
                                {/* Line separator */}
                                <div className="w-full h-px bg-gray-200 my-5"></div>
                                <Link href={'/admin/products'} onClick={ () => closeMenu() }
                                    className="flex gap-2 items-center p-2 hover:bg-gray-100 rounded transition-all"
                                >
                                    <IoShirtOutline size={20} />
                                    <span className="tex-xl">Productos</span>
                                </Link>
                                <Link href={'/admin/orders'} onClick={ () => closeMenu() }
                                    className="flex gap-2 items-center p-2 hover:bg-gray-100 rounded transition-all"
                                >
                                    <IoTicketOutline size={20} />
                                    <span className="tex-xl">Ordenes</span>
                                </Link>
                                <Link href={'/admin/users'} onClick={ () => closeMenu() }
                                    className="flex gap-2 items-center p-2 hover:bg-gray-100 rounded transition-all"
                                >
                                    <IoPeopleOutline size={20} />
                                    <span className="tex-xl">Usuarios</span>
                                </Link>
                            </>
                        )
                    }
                </div>
            </nav>
        </div>
    )
}
