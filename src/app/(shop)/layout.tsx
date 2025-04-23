import { Footer, Sidebar, TopMenu } from '@/components';

export default function ShopLayout({children}: {children: React.ReactNode;}) {
    return (
        <main className="min-h-screen">
            <TopMenu />
            <Sidebar />
            <div className='px-10 sm:px-10'>
                { children }
            </div>
            <Footer />
        </main>
    );
}