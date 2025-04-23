'use client';

import { generatePaginationNumbers } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const pageString = searchParams.get('page') ?? 1;
  const currentPage = isNaN(+pageString) ? 1 : +pageString;

  if(currentPage < 1 || isNaN(+pageString)) redirect(`${pathName}`);

  const allPages = generatePaginationNumbers(currentPage, totalPages);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams( searchParams );

    if ( +pageNumber <= 0 ) {
      return `${pathName}`; // href="/kid"
    } 

    if (+pageNumber > totalPages) return `${pathName}?${params.toString()}`; // href="/kid"

    params.set('page', pageNumber.toString());

    return `${pathName}?${params.toString()}`;
  }

  return (
    <div className="flex justify-center text-center mt-10 mb-32">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none p-0 gap-2">
          <li className="page-item list-none">
            <a
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-200 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={ createPageUrl(currentPage - 1) }
              aria-disabled={ currentPage === 1 ? 'true' : 'false' }
            >
              <IoChevronBackOutline size={20} />
            </a>
          </li>
          
          {
            allPages.map((pageNumber) => (
              <li key={ pageNumber } className="page-item list-none">
                <Link
                  className={
                    clsx(
                      "page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-200 rounded text-gray-800 focus:shadow-none",
                      {
                        'bg-blue-500 shadow-sm text-white hover:bg-blue-500 hover:text-white': pageNumber === currentPage
                      }
                    )
                  }
                  href={ createPageUrl(pageNumber) }
                >
                  { pageNumber }
                </Link>
              </li>
            ))
          }
          
          <li className="page-item list-none">
            <a
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-200 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={ createPageUrl(currentPage + 1)}
              aria-disabled={ currentPage === 1 ? 'true' : 'false' }
            >
              <IoChevronForwardOutline size={20} />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
