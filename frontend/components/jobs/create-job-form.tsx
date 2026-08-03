'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, CircularProgress, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { createJobThunk } from '@/features/job/job.slice';
import { fetchOrganizationsThunk } from '@/features/organization/organization.slice';
import { useSnackbar } from 'notistack';
import { createJobSchema, CreateJobFormValues } from '@/features/job/job.schema';
import styles from './create-job-form.module.css';

export default function CreateJobForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { organizations, loading } = useSelector((state: RootState) => state.organization);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: '',
      role: '',
      organizationId: '',
      location: '',
      experienceNeeded: '',
      packageOffered: '',
      jobType: 'FULL_TIME',
      workplaceType: 'ON_SITE',
      description: '',
    },
  });

  useEffect(() => {
    dispatch(fetchOrganizationsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (organizations.length > 0) {
      setValue('organizationId', organizations[0].id);
    }
  }, [organizations, setValue]);

  const onSubmit = async (data: CreateJobFormValues) => {
    try {
      await dispatch(createJobThunk(data)).unwrap();
      enqueueSnackbar('Job posted successfully!', { variant: 'success' });
      router.push('/jobs');
    } catch (err: unknown) {
      enqueueSnackbar((err as Error).message || 'Failed to post job', { variant: 'error' });
    }
  };

  return (
    <Card elevation={0} className={styles.cardContainer}>
      <CardContent>
        <Typography variant="h5" className={styles.title}>
          Post a new Job Opportunity
        </Typography>
        <Typography className={styles.subtitle}>Reach thousands of qualified candidates across India and beyond.</Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : organizations.length === 0 ? (
          <Box className={styles.emptyStateBox}>
            <BusinessIcon sx={{ fontSize: 56, color: '#0A66C2' }} />
            <Typography className={styles.emptyTitle}>Organization Required</Typography>
            <Typography className={styles.emptySubtitle}>
              Only members or owners of an organization can post job opportunities. You currently do not belong to any organization.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} className={styles.createOrgBtn} onClick={() => router.push('/organization/new')}>
              Create an Organization
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} className={styles.formGrid}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Job Title"
                  placeholder="e.g. Senior Full Stack Engineer"
                  size="small"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Box className={styles.formRow}>
              <Box className={styles.formRowHalf}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Job Role"
                      placeholder="e.g. Software Development"
                      size="small"
                      error={!!errors.role}
                      helperText={errors.role?.message}
                    />
                  )}
                />
              </Box>

              <Box className={styles.formRowHalf}>
                <Controller
                  name="organizationId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Organization"
                      size="small"
                      error={!!errors.organizationId}
                      helperText={errors.organizationId?.message}
                    >
                      {organizations.map((org) => (
                        <MenuItem key={org.id} value={org.id}>
                          {org.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
            </Box>
            <Box className={styles.formRow}>
              <Box className={styles.formRowHalf}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Location"
                      placeholder="e.g. Bengaluru, Karnataka"
                      size="small"
                      error={!!errors.location}
                      helperText={errors.location?.message}
                    />
                  )}
                />
              </Box>

              <Box className={styles.formRowHalf}>
                <Controller
                  name="experienceNeeded"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Experience Needed"
                      placeholder="e.g. 2 - 5 Years"
                      size="small"
                      error={!!errors.experienceNeeded}
                      helperText={errors.experienceNeeded?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            <Controller
              name="packageOffered"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Package Offered (INR)"
                  placeholder="e.g. ₹12 - 18 LPA"
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography className={styles.currencyAdornment}>₹</Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.packageOffered}
                  helperText={errors.packageOffered?.message || 'Specified in Indian Rupee (INR ₹)'}
                />
              )}
            />

            <Box className={styles.formRow}>
              <Box className={styles.formRowHalf}>
                <Controller
                  name="jobType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Job Type"
                      size="small"
                      error={!!errors.jobType}
                      helperText={errors.jobType?.message}
                    >
                      <MenuItem value="FULL_TIME">Full-time</MenuItem>
                      <MenuItem value="PART_TIME">Part-time</MenuItem>
                      <MenuItem value="CONTRACT">Contract</MenuItem>
                      <MenuItem value="INTERNSHIP">Internship</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              <Box className={styles.formRowHalf}>
                <Controller
                  name="workplaceType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Workplace Type"
                      size="small"
                      error={!!errors.workplaceType}
                      helperText={errors.workplaceType?.message}
                    >
                      <MenuItem value="ON_SITE">On-site</MenuItem>
                      <MenuItem value="HYBRID">Hybrid</MenuItem>
                      <MenuItem value="REMOTE">Remote</MenuItem>
                    </TextField>
                  )}
                />
              </Box>
            </Box>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={5}
                  label="Job Description"
                  placeholder="Detail key responsibilities, requirements, and benefits..."
                  size="small"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <Button type="submit" variant="contained" fullWidth className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Posting Job...' : 'Post Job'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
