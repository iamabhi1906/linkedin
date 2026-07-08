'use client';

import { AppDispatch, RootState } from '@/app/store';
import TextInputBox from '@/components/ui/text-input-box';
import { login } from '@/features/auth/auth.slice';
import { Signin, SigninSchema } from '@/features/auth/auth.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, Container, Link, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

export default function SignInPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { error, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const { control, handleSubmit } = useForm<Signin>({
    resolver: zodResolver(SigninSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSignin = (payload: Signin) => {
    dispatch(login(payload));
    router.replace('/dashboard');
  };

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user]);

  return (
    <Box
      sx={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(handleSignin)}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Sign in
              </Typography>

              {error && (
                <Typography color="error" sx={{ py: 2, textAlign: 'center', textTransform: 'capitalize' }}>
                  {error.path}
                </Typography>
              )}

              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextInputBox control={control} name={'email'} label="Email" />
                <TextInputBox control={control} name={'password'} label="Password" />
              </Stack>

              <Box sx={{ mt: 1, mb: 3 }}>
                <Link href="/forgot-password" component={NextLink} sx={{ fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </Box>

              <Button fullWidth variant="contained" size="large" type="submit">
                Sign in
              </Button>
            </form>

            <Typography variant="body2" sx={{ alignItems: 'center', mt: 4 }}>
              New to LinkedIn?{' '}
              <Link component={NextLink} href="/signup" sx={{ fontWeight: 500 }}>
                Join now
              </Link>
            </Typography>
          </CardContent>
        </Card>

        <Typography color="text.secondary" variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
          By clicking Continue, you agree to LinkedIn&apos;s User Agreement, Privacy Policy, and Cookie Policy.
        </Typography>
      </Container>
    </Box>
  );
}
