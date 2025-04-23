'use client';

import { IoAdd, IoRemove } from "react-icons/io5";

interface Props {
    quantity: number;

    onQuantityChanged: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {
    const onValueChanged = (value: number) => {
        if( quantity + value < 1 ) return;
        onQuantityChanged(quantity + value);
    }

  return (
    <div className="flex gap-4">
        <button
            onClick={ () => onValueChanged(-1)} 
            className="flex justify-center items-center border-0 bg-transparent font-bold">
            <IoRemove size={ 16 } />
        </button>
        <span className="w-15 py-2 rounded-md bg-gray-200 text-center">
            { quantity }
        </span>
        <button 
            onClick={ () => onValueChanged(+1)} 
            className="flex justify-center items-center border-0 bg-transparent font-bold">
            <IoAdd size={ 16 } />
        </button>
    </div>
  )
}
