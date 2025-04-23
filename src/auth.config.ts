import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import prisma from './lib/prisma'
import bcryptjs from 'bcryptjs';
import { User } from '@prisma/client';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    authorized({ request: {} }) {
      //? Podemos controlar el acceso a las rutas de la aplicación con la información que nos da auth
      //? auth tiene la información del usuario logueado, si no está logueado, auth.user es nul
  
      // console.log({auth})
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      return true;
    },
    
    jwt({ token, user }) {
      if(user) token.data = user;
      return token
    },

    session({ session, token }) {
      session.user = token.data as {
        id: string;
        name: string;
        email: string;
        emailVerified?: boolean;
        role: string;
        image?: string;
      } & User;
      return session;
    }
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null
        
        const { email, password: userPassword } = parsedCredentials.data

        


        // Buscar el correo
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        })

        if (!user) return null;
        
        // Comparar contraseñas
        if(!bcryptjs.compareSync(userPassword, user.password)) return null;

        // Devolver usuario sin el password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...rest } = user;
        return rest;
      },
    }),
  ]
}

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)