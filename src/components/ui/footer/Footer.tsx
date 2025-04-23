import { titleFont } from '@/config/fonts';
import Link from 'next/link';


export const Footer = () => {
  return (
    <div className="flex w-full gap-3 justify-center text-xs mb-10">
      <Link href={'/'}>
        <span className={`${ titleFont.className } antialiased font-bold`}>Testo</span>
        <span> | shop </span>
        <span>© { new Date().getFullYear() }</span>
      </Link>

      <Link href={'/'}>Privacidad & legal</Link>
      <Link href={'/'}>Ubicaciones</Link>
    </div>
  )
}
