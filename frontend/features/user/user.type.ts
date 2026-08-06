export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  authProvider: string;
  googleId: string | null;
  profilePicture: string | null;
  coverPicture: string | null;
  headline: string | null;
  about: string | null;
  location: string | null;
  website: string | null;
  isVerified: boolean;
  isPrivate?: boolean;
  status: string;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
