'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, Checkbox, Container, FormControlLabel, InputAdornment, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { signupThunk } from '@/features/auth/auth.action';
import { Signup, SignupSchema } from '@/features/auth/auth.types';
import { useSnackbar } from 'notistack';
import { signIn } from 'next-auth/react';
import styles from './page.module.css';
import LinkedInLogo from '@/components/linkedin-logo';

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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
      enqueueSnackbar('Account created successfully!', { variant: 'success' });
      router.replace('/signin');
    } catch (err: unknown) {
      enqueueSnackbar((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Signup failed', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={styles.pageContainer}>
      <Box className={styles.headerBar}>
        <Link href="/" className={styles.logoLink}>
          <LinkedInLogo height={52} />
        </Link>
      </Box>

      <Box className={styles.contentWrapper}>
        <Typography className={styles.pageHeading}>Join LinkedIn now — it’s free!</Typography>

        <Card elevation={0} className={styles.cardContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={styles.nameRow}>
              <Box className={styles.formGroup}>
                <Typography className={styles.inputLabel}>First name</Typography>
                <Controller
                  name="firstName"
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
                <Typography className={styles.inputLabel}>Last name</Typography>
                <Controller
                  name="lastName"
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
            </Box>

            <Box className={styles.formGroup}>
              <Typography className={styles.inputLabel}>Email or phone number</Typography>
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
              <Typography className={styles.inputLabel}>Password (6+ characters)</Typography>
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
                            <Button className={styles.togglePasswordBtn} onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? 'Hide' : 'Show'}
                            </Button>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box className={styles.rememberMeBox}>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className={styles.checkboxIcon} />}
                label={<Typography className={styles.checkboxLabel}>Remember me</Typography>}
              />
            </Box>

            <Typography className={styles.disclaimerText}>
              By clicking Agree & Join or Continue, you agree to the LinkedIn <a className={styles.disclaimerLink}>User Agreement</a>,{' '}
              <a className={styles.disclaimerLink}>Privacy Policy</a>, and <a className={styles.disclaimerLink}>Cookie Policy</a>.
            </Typography>

            <Button type="submit" fullWidth variant="contained" disabled={submitting} className={styles.submitBtn}>
              Agree & Join
            </Button>
          </form>

          <Box className={styles.dividerBox}>
            <Box className={styles.dividerLine} />
            <Typography className={styles.dividerText}>or</Typography>
            <Box className={styles.dividerLine} />
          </Box>

          {/* <Button fullWidth variant="outlined" onClick={handleGoogleSignIn} startIcon={<GoogleIcon />} className={styles.googleBtn}>
            Continue with Google
          </Button> */}

          <Typography className={styles.alreadyUserText}>
            Already on LinkedIn?{' '}
            <Link href="/signin" className={styles.signinLink}>
              Sign in
            </Link>
          </Typography>
        </Card>

        <Typography className={styles.businessPromptText}>
          Looking to create a page for a business? <a className={styles.businessLink}>Get help</a>
        </Typography>
      </Box>

      <Box className={styles.footerBar}>
        <Container maxWidth="lg">
          <Box className={styles.footerLinksRow}>
            <span>LinkedIn Corporation © 2026</span>
            <a className={styles.footerLink}>About</a>
            <a className={styles.footerLink}>Accessibility</a>
            <a className={styles.footerLink}>User Agreement</a>
            <a className={styles.footerLink}>Privacy Policy</a>
            <a className={styles.footerLink}>Cookie Policy</a>
            <a className={styles.footerLink}>Copyright Policy</a>
            <a className={styles.footerLink}>Brand Policy</a>
            <a className={styles.footerLink}>Guest Controls</a>
            <a className={styles.footerLink}>Community Guidelines</a>
            <a className={styles.footerLink}>Language ▾</a>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
