'use client';

import { authenticate } from '@/actions';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
//import { useRouter } from 'next/router';
import React, { useActionState, useEffect } from 'react'
//import { useFormState } from 'react-dom';
import { IoLogInOutline, IoWarningOutline } from 'react-icons/io5';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );  

  useEffect(() => {
    //? Aquí usamos el valor Success que podemos devolver manualmente en login.ts
    //? para redireccionar al home si es correcto
    if(errorMessage === 'Success') {
      // Redireccionar
      window.location.replace(callbackUrl);
    }
  }, [errorMessage, callbackUrl])

  /* const router = useRouter();
  const [state, dispatch] = useFormState(authenticate, undefined)
  useEffect(() => {
    //? Aquí usamos el valor Success que podemos devolver manualmente en login.ts
    //? para redireccionar al home si es correcto
    if(state === 'Success') {
      // Redireccionar
      router.replace('/');
    }
  }, [state]) */
  
  return (
    <form action={formAction} className="flex flex-col">

      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border border-gray-200 bg-gray-200 rounded mb-5"
        type="email"
        name="email" /* <- Necesario para poder validar el formulario en Auth conf */
      />

      <label htmlFor="email">Contraseña</label>
      <input
        className="px-5 py-2 border border-gray-200 bg-gray-200 rounded mb-5"
        type="password"
        name="password" /* <- Necesario para poder validar el formulario en Auth conf */
      />

      <input type="hidden" name="redirectTo" value={ callbackUrl } />
      <button aria-disabled={ isPending } disabled={ isPending } className={
        clsx({
          "btn-primary w-full h-9 flex items-center justify-center gap-2": !isPending,
          "w-full h-9 flex items-center justify-center gap-2 bg-gray-500 text-white cursor-not-allowed": isPending
        })
      } >
        <span className='text-md'>Ingresar</span>
        <IoLogInOutline size={15} className="text-gray-50" />
      </button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link
        href="/auth/new-account"
        className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>

      <div
          className="flex items-center gap-2 my-4"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <IoWarningOutline size={ 15 } className="text-red-500" />
              <p className="text-sm text-red-500 m-0">{ errorMessage }</p>
            </>
          )}
        </div>
    </form>
  )
}
