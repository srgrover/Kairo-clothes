'use client';

import { getStockBySlug } from "@/actions";
import { useEffect, useState } from "react"

interface Props {
  slug: string
}

export const StockLabel = ({ slug }: Props) => {

  const [stock, setStock] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getStock = async () => {
      const stock = await getStockBySlug(slug);
      setStock(stock);
      setIsLoading(false)
    }

    getStock()
  }, [slug]) // Ahora solo dependemos del slug

  return (
    <>
      {
        isLoading ?
          <h1 className={`text-lg text-gray-600 bg-gray-200 w-30 rounded-sm flex animate-pulse`}>
            &nbsp;
          </h1> :
          <h1 className={`text-lg text-gray-600`}>
            Stock: { stock }
          </h1>
      }
    </>
  )
}
