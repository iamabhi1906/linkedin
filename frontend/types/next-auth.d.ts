import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      firstName?: string;
      lastName?: string;
      headline?: string;
      profilePicture?: string;
    } & DefaultSession['user'];
  }
}
