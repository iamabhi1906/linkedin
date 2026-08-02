'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { createOrganizationThunk } from '@/features/organization/organization.slice';
import { useSnackbar } from 'notistack';

export default function CreateOrganizationPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const org = await dispatch(createOrganizationThunk(data)).unwrap();
      enqueueSnackbar('Organization page created!', { variant: 'success' });
      router.push(`/organization/${org.slug}`);
    } catch (err: any) {
      enqueueSnackbar(err || 'Failed to create organization', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Create a LinkedIn Page
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField fullWidth label="Page Name" {...register('name', { required: true })} margin="normal" size="small" />
            <TextField fullWidth label="Tagline" {...register('tagline')} margin="normal" size="small" />
            <TextField fullWidth multiline rows={3} label="About" {...register('about')} margin="normal" size="small" />
            <TextField fullWidth label="Website URL" {...register('website')} margin="normal" size="small" />
            <TextField fullWidth label="Industry" {...register('industry')} margin="normal" size="small" placeholder="Technology, Software, Finance..." />
            <TextField fullWidth label="Location" {...register('location')} margin="normal" size="small" />

            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3, borderRadius: 5, textTransform: 'none', fontWeight: 600 }}>
              Create Page
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
