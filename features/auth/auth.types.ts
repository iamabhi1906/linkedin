import z from 'zod';

export const SignupSchema = z
  .object({
    name: z.string('Name is required').min(2, 'Name must be at least 2 characters').min(1, 'Name is required'),
    email: z.email('Email address is required').min(1, 'Email is required'),
    password: z
      .string('Valid password is required')
      .min(6, 'Password must be at least 6 characters')
      .min(1, 'Password is required'),
      // .regex(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      // ),
    confirmPassword: z.string('Valid password is required').min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const SigninSchema = z.object({
  email: z.email('Email address is required').min(1, 'Email is required'),
  password: z.string('Valid password is required').min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

export const UserSchema = z.object({
  name: z.string('Name is required').min(2, 'Name must be at least 2 characters').min(1, 'Name is required'),
  email: z.email('Email address is required').min(1, 'Email is required'),
  password: z.string('Valid password is required').min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

export type User = z.infer<typeof UserSchema>;
export type Signup = z.infer<typeof SignupSchema>;
export type Signin = z.infer<typeof SigninSchema>;
