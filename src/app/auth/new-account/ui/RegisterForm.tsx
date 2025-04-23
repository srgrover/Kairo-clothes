'use client';

import { login, registerUser } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  name: string
  email: string
  password: string
}

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    const { name, email, password } = data;
    const res = await registerUser( name, email, password );

    if( !res.ok ) {
      setErrorMessage(res.message || '');
      return;
    }

    await login( email.toLowerCase(), password );
    window.location.replace('/');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label htmlFor="email">Nombre</label>
        <input
          className={
            clsx(
             "px-3 py-2 border border-gray-200 bg-gray-200 rounded",
             {
               "border-red-500": !!errors.name
             } 
            )
          }
          type="text" autoFocus
          {...register('name', { required: true })}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email">Correo electrónico</label>
        <input
          className={
            clsx(
             "px-3 py-2 border border-gray-200 bg-gray-200 rounded",
             {
               "border-red-500": !!errors.email
             } 
            )
          }
          type="email"
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email">Contraseña</label>
        <input
          className={
            clsx(
             "px-3 py-2 border border-gray-200 bg-gray-200 rounded",
             {
               "border-red-500": !!errors.password
             } 
            )
          }
          type="password"
          {...register('password', { required: true, minLength: 6 })}
        />
      </div>
      
      <span className="text-red-500">{ errorMessage }</span>

      <button
        className="btn-primary">
        Crear cuenta
      </button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link
        href="/auth/login"
        className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  )
}
