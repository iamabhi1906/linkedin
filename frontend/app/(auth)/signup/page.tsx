'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { signupThunk } from '@/features/auth/auth.action';
import { Signup, SignupSchema } from '@/features/auth/auth.types';
import { FormInput } from '@/components/forms/form-input';
import { useSnackbar } from 'notistack';
import LinkedInLogo from '@/components/linkedin-logo';

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<Signup>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: Signup) => {
    setSubmitting(true);
    try {
      await dispatch(
        signupThunk({
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
        }),
      ).unwrap();
      enqueueSnackbar('Account created successfully!', { variant: 'success' });
      router.replace('/signup');
    } catch (err: unknown) {
      enqueueSnackbar((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Signup failed', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ pt: 4, pb: 8 }}>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <LinkedInLogo width={120} height={32} />
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 2, textAlign: 'center' }}>
            Make the most of your professional life
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2 }}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput name="firstName" control={control} label="First Name" />
              <FormInput name="lastName" control={control} label="Last Name" />
              <FormInput name="email" control={control} label="Email" />
              <FormInput name="password" control={control} label="Password (6+ characters)" type="password" />
              <FormInput name="confirmPassword" control={control} label="Confirm Password" type="password" />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{ borderRadius: 5, py: 1.2, mt: 2, textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
              >
                Agree & Join
              </Button>
            </form>
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Already on LinkedIn?{' '}
          <Link href="/signin" style={{ color: '#0A66C2', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
