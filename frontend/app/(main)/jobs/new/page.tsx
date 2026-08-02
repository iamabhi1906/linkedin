'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { createJobThunk } from '@/features/job/job.slice';
import { fetchOrganizationsThunk } from '@/features/organization/organization.slice';
import { useSnackbar } from 'notistack';

export default function PostJobPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { organizations } = useSelector((state: RootState) => state.organization);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    dispatch(fetchOrganizationsThunk());
  }, [dispatch]);

  const onSubmit = async (data: any) => {
    try {
      await dispatch(createJobThunk(data)).unwrap();
      enqueueSnackbar('Job posted successfully!', { variant: 'success' });
      router.push('/jobs');
    } catch (err: any) {
      enqueueSnackbar(err || 'Failed to post job', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Post a Job
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField fullWidth label="Job Title" {...register('title', { required: true })} margin="normal" size="small" />
            <TextField fullWidth multiline rows={4} label="Description" {...register('description', { required: true })} margin="normal" size="small" />

            <TextField fullWidth select label="Organization" {...register('organizationId', { required: true })} margin="normal" size="small" defaultValue="">
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField fullWidth label="Location" {...register('location')} margin="normal" size="small" />
            <TextField fullWidth label="Salary Range" {...register('salaryRange')} margin="normal" size="small" placeholder="$100k - $120k / year" />

            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3, borderRadius: 5, textTransform: 'none', fontWeight: 600 }}>
              Post Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
