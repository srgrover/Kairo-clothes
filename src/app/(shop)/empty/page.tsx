import { IoCartOutline } from "react-icons/io5"
import Link from 'next/link';

export default function EmptyCartPage() {
  return (
    <div className="flex flex-col justify-center items-center h-[800px]">
      <IoCartOutline size={ 80 } className="mx-5" />

      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Tu cesta de la compra está vacía</h1>
        <Link href={'/'} className="text-blue-500 mt-2 text-2xl hover:underline">Añade algo al carrito</Link>
      </div>
    </div>
  );
}