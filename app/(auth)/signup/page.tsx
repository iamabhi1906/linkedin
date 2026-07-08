'use client';

import { AppDispatch, RootState } from '@/app/store';
import TextInputBox from '@/components/ui/text-input-box';
import { signup } from '@/features/auth/auth.slice';
import { Signup, SignupSchema } from '@/features/auth/auth.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, Container, Divider, Stack, Typography, Link } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styles from './page.module.css';
import { Google } from '@mui/icons-material';

export default function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { error, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const { control, handleSubmit } = useForm<Signup>({
    resolver: zodResolver(SignupSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSignup = (payload: Signup) => {
    dispatch(signup(payload));
    router.replace('/dashboard');
  };

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user]);

  return (
    <Box className={styles.page}>
      <Typography className={styles.joinText} variant="body1">
        Join LinkedIn now — it&apos;s free!
      </Typography>
      <Container maxWidth="xs">
        <Card elevation={2}>
          <CardContent className={styles.cardContent}>
            {error && <Typography color="error">{error.reason}</Typography>}

            <form onSubmit={handleSubmit(handleSignup)}>
              <Stack spacing={2}>
                <TextInputBox name="name" control={control} label="Full name" />
                <TextInputBox name="email" control={control} label="Email" />
                <TextInputBox name="password" control={control} label="Password" />
                <TextInputBox name="confirmPassword" control={control} label="Confirm Password" />
              </Stack>

              {/* <Typography variant="caption" color="text.secondary">
                By clicking Agree & Join, you agree to the Terms, Privacy Policy, and Cookie Policy.
              </Typography> */}

              <Button fullWidth variant="contained" type="submit" className={`${styles.fullRound}`}>
                Agree & Join
              </Button>
            </form>

            <Divider className={styles.divider}>or</Divider>

            <Button fullWidth variant="outlined" className={styles.fullRound} startIcon={<Google />}>
              Continue with Google
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
              Already on LinkedIn?{' '}
              <Link component={NextLink} href="/signin" underline="hover" sx={{ fontWeight: 500 }}>
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
