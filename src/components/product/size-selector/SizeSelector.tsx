import type { Size } from "@/interfaces";
import clsx from "clsx";

interface Props {
  selectedSize?: Size;
  availableSizes: Size[];

  onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({ selectedSize, availableSizes, onSizeChanged }: Props) => {



  return (
    <div className="my-5">
        <h3 className="font-bold mb-4">Tallas disponibles</h3>

        <div className="flex gap-3">
            {
                availableSizes.map((size) => (
                    <button
                    onClick={() => onSizeChanged(size)}
                        key={size}
                        className={
                            clsx(
                                "hover:underline text-lg bg-transparent border-0",
                                {
                                    'underline': selectedSize === size 
                                }
                            )
                        }
                        //onClick={() => setSelectedSize(size)}
                    >
                        {size}
                    </button>
                ))
            }
        </div>
    </div>
  )
}
