import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { data: existing } = await db
        .from('users')
        .select('id')
        .eq('email', user.email!)
        .single()

      if (!existing) {
        await db.from('users').insert({
          name: user.name!,
          email: user.email!,
          image: user.image,
        })
      }
      return true
    },
    async session({ session }) {
      const { data: dbUser } = await db
        .from('users')
        .select('id, role, points, coins')
        .eq('email', session.user.email!)
        .single()

      if (dbUser) {
        session.user = { ...session.user, ...dbUser }
      }
      return session
    },
  },
}
