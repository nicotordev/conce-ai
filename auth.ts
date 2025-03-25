
import NextAuth from 'next-auth'
import { nextAuthConfig } from './config/auth/index.auth'

export const { handlers, auth, signIn, signOut } = NextAuth(nextAuthConfig)