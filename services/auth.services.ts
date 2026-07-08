import { Signup, User } from '@/features/auth/auth.types';

export const signinService = async (email: string, password: string): Promise<User> => {
  const rawUsers = await localStorage.getItem('users');
  if (!rawUsers) throw new Error('invalid credentials');
  const users = await JSON.parse(rawUsers);
  const user = await users.find((u: User) => u.email === email && u.password === password);
  if (!user) throw new Error('invalid credentials');
  await localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const signupService = async (data: Signup): Promise<User> => {
  const rawUsers = await localStorage.getItem('users');
  const users: User[] = rawUsers ? JSON.parse(rawUsers) : [];
  const exists = await users.some((user) => user.email === data.email);
  if (exists) throw new Error('Email already exists');
  const newUser: User = {
    name: data.name,
    email: data.email,
    password: data.password,
  };
  users.push(newUser);
  await localStorage.setItem('users', JSON.stringify(users));
  await localStorage.setItem('currentUser', JSON.stringify(newUser));
  return newUser;
};

export const getCurrentUserService = async (): Promise<User> => {
  const rawUser = localStorage.getItem('currentUser');
  if (!rawUser) {
    throw new Error('No authenticated user');
  }
  return JSON.parse(rawUser);
};

export const removeCurrentUserService = async () => {
  localStorage.removeItem('currentUser');
};
