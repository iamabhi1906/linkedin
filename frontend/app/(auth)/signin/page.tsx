'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, Checkbox, Container, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { loginThunk } from '@/features/auth/auth.action';
import { Signin, SigninSchema } from '@/features/auth/auth.types';
import { useSnackbar } from 'notistack';
import { signIn } from 'next-auth/react';
import styles from './signin.module.css';
import LinkedInLogo from '@/components/linkedin-logo';

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

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
      router.refresh();
    } catch (err: unknown) {
      enqueueSnackbar((err as { message?: string }).message || 'Invalid credentials', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <Box className={styles.pageContainer}>
      <Box className={styles.headerBar}>
        <Link href="/" className={styles.logoLink}>
          <LinkedInLogo height={52} />
        </Link>
      </Box>

      <Box className={styles.contentWrapper}>
        <Card elevation={0} className={styles.cardContainer}>
          <Typography className={styles.cardTitle}>Sign in</Typography>
          <Typography className={styles.cardSubtitle}>
            New to LinkedIn?
            <Link href="/signup" className={styles.joinLink}>
              Join now
            </Link>
          </Typography>

          {/* Social Sign In Buttons */}
          {/* <Box className={styles.socialButtonsGroup}>
            <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} startIcon={<GoogleIcon />} className={styles.googleBtn}>
              Continue with Google
            </Button>

            <Button fullWidth variant="outlined" startIcon={<AppleIcon />} className={styles.appleBtn}>
              Sign in with Apple
            </Button>
          </Box> */}

          <Typography className={styles.disclaimerText}>
            By continuing, you agree to LinkedIn’s <a className={styles.disclaimerLink}>User Agreement</a>,{' '}
            <a className={styles.disclaimerLink}>Privacy Policy</a>, and <a className={styles.disclaimerLink}>Cookie Policy</a>.
          </Typography>

          <Box className={styles.dividerBox}>
            <Box className={styles.dividerLine} />
            <Typography className={styles.dividerText}>or</Typography>
            <Box className={styles.dividerLine} />
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={styles.formGroup}>
              <Typography className={styles.inputLabel}>Email or phone</Typography>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    error={Boolean(error)}
                    helperText={error?.message}
                    className={styles.inputField}
                  />
                )}
              />
            </Box>

            <Box className={styles.formGroup}>
              <Typography className={styles.inputLabel}>Password</Typography>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={Boolean(error)}
                    helperText={error?.message}
                    className={styles.inputField}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box className={styles.forgotPasswordBox}>
              <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                Forgot password?
              </Link>
            </Box>

            <Box className={styles.keepSignedInBox}>
              <FormControlLabel
                control={<Checkbox checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.target.checked)} className={styles.checkboxIcon} />}
                label={<Typography className={styles.checkboxLabel}>Keep me signed in</Typography>}
              />
            </Box>

            <Button type="submit" fullWidth variant="contained" disabled={submitting} className={styles.submitBtn}>
              Sign in
            </Button>
          </form>
        </Card>
      </Box>

      <Box className={styles.footerBar}>
        <Container maxWidth="lg">
          <Box className={styles.footerLinksRow}>
            <span>LinkedIn Corporation © 2026</span>
            <a className={styles.footerLink}>User Agreement</a>
            <a className={styles.footerLink}>Privacy Policy</a>
            <a className={styles.footerLink}>Community Guidelines</a>
            <a className={styles.footerLink}>Cookie Policy</a>
            <a className={styles.footerLink}>Copyright Policy</a>
            <a className={styles.footerLink}>Send Feedback</a>
            <a className={styles.footerLink}>Language ▾</a>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
