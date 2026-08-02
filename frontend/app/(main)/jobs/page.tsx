'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  InputBase,
  Typography,
} from '@mui/material';
import { Search as SearchIcon, Work as WorkIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { searchJobsThunk } from '@/features/job/job.slice';
import { jobService } from '@/services/jobs/job.service';
import { useSnackbar } from 'notistack';

export default function JobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { jobs, loading } = useSelector((state: RootState) => state.job);

  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    dispatch(searchJobsThunk({ q: '', location: '' }));
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchJobsThunk({ q, location }));
  };

  const handleApply = async (jobId: string) => {
    try {
      await jobService.apply(jobId, 'Interested in this role');
      enqueueSnackbar('Job application submitted!', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to apply', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Search Header Bar */}
      <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, mb: 3, p: 2 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#EDF3F8', borderRadius: 1, px: 2, py: 1, flex: 1, minWidth: 200 }}>
            <SearchIcon sx={{ color: '#666666', mr: 1 }} />
            <InputBase fullWidth placeholder="Search job title, skill, or company" value={q} onChange={(e) => setQ(e.target.value)} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#EDF3F8', borderRadius: 1, px: 2, py: 1, flex: 1, minWidth: 200 }}>
            <LocationIcon sx={{ color: '#666666', mr: 1 }} />
            <InputBase fullWidth placeholder="City, state, or zip code" value={location} onChange={(e) => setLocation(e.target.value)} />
          </Box>

          <Button type="submit" variant="contained" sx={{ borderRadius: 5, px: 4, fontWeight: 600, textTransform: 'none' }}>
            Search
          </Button>
        </Box>
      </Card>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Recommended Jobs ({jobs.length})
      </Typography>

      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid key={job.id} size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <WorkIcon sx={{ color: '#0A66C2' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.organization?.name || 'Company'} • {job.location || 'Remote'}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ my: 1, fontSize: '0.875rem' }}>
                  {job.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  {job.jobType} • {job.workplaceType} • {job.salaryRange || 'Salary negotiable'}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() => handleApply(job.id)}
                sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600, alignSelf: 'flex-start' }}
              >
                Easy Apply
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
