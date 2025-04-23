'use server';
 
import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // await signIn('credentials', formData);
    //? Podemos manejar el return manualmente y mandar redirect a false si queremos así:
    await signIn('credentials', {
      ...Object.fromEntries(formData), 
      redirect: false
    }); 
    
    return 'Success';
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Authentication error.';
    }
    throw error;
  }
}


export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false
    }); 

    return {
      ok: true,
    }
  } catch (error) {
    console.error(error); 

    return {
      ok: false,
      message: 'No se pudo iniciar sesión'
    }
  } 
}