'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Typography, Button, Alert, Card, CardContent, Container } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FormInput } from '@/components/forms/form-input';
import { useSnackbar } from 'notistack';
import apiClient from '@/lib/axios';

const verifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type FormValues = z.infer<typeof verifyOtpSchema>;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: initialEmail,
      otp: '',
    },
  });

  const emailValue = watch('email');

  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail);
    }
  }, [initialEmail, setValue]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await apiClient.post('/auth/verify-otp', data);
      enqueueSnackbar('Email verified successfully!', { variant: 'success' });
      router.push('/signin');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Verification failed';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailValue || resendTimer > 0) return;
    try {
      await apiClient.post('/auth/resend-otp', { email: emailValue });
      enqueueSnackbar('OTP sent to your email!', { variant: 'success' });
      setResendTimer(60);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to resend OTP';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <Box sx={{ pt: 4, pb: 8 }}>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <MarkEmailReadIcon fontSize="large" color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 1, textAlign: 'center' }}>
            Verify Email
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
            We sent a 6-digit verification code to your email
          </Typography>
        </Box>

        <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2 }}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput name="email" control={control} label="Email Address" />

              <FormInput
                name="otp"
                control={control}
                label="6-Digit OTP Code"
                slotProps={{
                  htmlInput: {
                    maxLength: 6,
                    style: { letterSpacing: '0.3rem', fontSize: '1.2rem', textAlign: 'center' },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<VerifiedUserIcon />}
                disabled={loading}
                sx={{ borderRadius: 5, py: 1.2, mt: 2, mb: 1.5, textTransform: 'none', fontWeight: 600 }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <Button
                type="button"
                variant="outlined"
                color="primary"
                size="medium"
                fullWidth
                startIcon={<RefreshIcon />}
                disabled={loading || resendTimer > 0 || !emailValue}
                onClick={handleResend}
                sx={{ borderRadius: 5, py: 1, mb: 2, textTransform: 'none' }}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </Button>

              <Typography variant="body2" sx={{ textAlign: 'center' }} color="textSecondary">
                Back to{' '}
                <Link href="/signin" style={{ color: '#0A66C2', textDecoration: 'none', fontWeight: 600 }}>
                  Sign In
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
