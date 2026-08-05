'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, Container, Divider, Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { signupThunk } from '@/features/auth/auth.action';
import { Signup, SignupSchema } from '@/features/auth/auth.types';
import { FormInput } from '@/components/forms/form-input';
import { useSnackbar } from 'notistack';
import LinkedInLogo from '@/components/linkedin-logo';
import styles from './page.module.css';
import InputField from '@/components/input-filed';
import TextInputBox from '@/components/ui/text-input-box';

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
      console.log("Hello");
      enqueueSnackbar('Account created successfully!', { variant: 'success' });
      router.replace('/signin');
    } catch (err: unknown) {
      enqueueSnackbar((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Signup failed', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={styles.signupPage}>
      <Box className={styles.logoContainer}>
        <LinkedInLogo width={175} height={68} />
      </Box>
      <Box className={styles.cardPage}>
        <Box className={styles.joinTextContainer}>
          <Typography variant="h5" className={styles.joinText}>
            Join LinkedIn now — it&apos;s free!
          </Typography>
        </Box>

        <Card elevation={0} className={styles.card}>
          <CardContent className={styles.cardContent1}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInputBox name="firstName" control={control} label="First Name" />
              <TextInputBox name="lastName" control={control} label="Last Name" />
              <TextInputBox name="email" control={control} label="Email" />
              <TextInputBox name="password" control={control} label="Password (6+ characters)" type="password" />

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
          <Divider>or</Divider>
          <CardContent className={styles.cardContent2}></CardContent>
        </Card>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Already on LinkedIn?{' '}
          <Link href="/signin" style={{ color: '#0A66C2', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Box>
      <Stack>Footer section</Stack>
    </Box>
  );
}
