'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { loginThunk } from '@/features/auth/auth.action';
import { Signin, SigninSchema } from '@/features/auth/auth.types';
import { FormInput } from '@/components/forms/form-input';
import { useSnackbar } from 'notistack';
import { signIn } from 'next-auth/react';
import LinkedInLogo from '@/components/linkedin-logo';

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<Signin>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: Signin) => {
    setSubmitting(true);
    try {
      await dispatch(loginThunk(data)).unwrap();
      enqueueSnackbar('Signed in successfully', { variant: 'success' });
      router.push('/');
    } catch (err: any) {
      enqueueSnackbar(err || 'Invalid credentials', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF', pt: 4, pb: 8 }}>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <LinkedInLogo width={120} height={32} />
        </Box>

        <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Stay updated on your professional world
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput name="email" control={control} label="Email" />
              <FormInput name="password" control={control} label="Password" type="password" />

              <Box sx={{ mt: 1, mb: 2, textAlign: 'right' }}>
                <Link href="/forgot-password" style={{ color: '#0A66C2', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{ borderRadius: 5, py: 1.2, textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
              >
                Sign in
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>or</Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon sx={{ color: '#EA4335' }} />}
              sx={{ borderRadius: 5, py: 1.2, textTransform: 'none', fontWeight: 600, color: '#1D2226', borderColor: '#B2B2B2' }}
            >
              Sign in with Google
            </Button>
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          New to LinkedIn?{' '}
          <Link href="/signup" style={{ color: '#0A66C2', textDecoration: 'none', fontWeight: 600 }}>
            Join now
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
