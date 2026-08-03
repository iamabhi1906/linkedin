import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (res.data?.user && res.data?.accessToken) {
            return {
              id: res.data.user.id,
              name: `${res.data.user.firstName || ''} ${res.data.user.lastName || ''}`.trim() || res.data.user.email,
              email: res.data.user.email,
              image: res.data.user.profilePicture,
              accessToken: res.data.accessToken,
              user: res.data.user,
            };
          }
          return null;
        } catch (error: unknown) {
          throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Invalid email or password');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = token.accessToken;
        token.user = user as User;
      }
      if (account?.provider === 'google') {
        try {
          const res = await axios.post(`${API_URL}/auth/google`, {
            googleId: account.providerAccountId,
            email: token.email,
            firstName: token.name?.split(' ')[0] || '',
            lastName: token.name?.split(' ').slice(1).join(' ') || '',
            picture: token.picture,
          });
          if (res.data?.accessToken) {
            token.accessToken = res.data.accessToken;
            token.user = res.data.user;
          }
        } catch (err) {
          console.error('Google auth backend syncing failed', err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user = (token.user as User) || session.user;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'linkedin_clone_nextauth_super_secret_key_2026',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
