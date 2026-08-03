'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { searchJobsThunk } from '@/features/job/job.slice';
import { jobService } from '@/services/jobs/job.service';
import { Job } from '@/features/job/job.type';
import JobCard from '@/components/jobs/job-card';
import JobDetailsPane from '@/components/jobs/job-details-pane';
import JobsSidebar from '@/components/jobs/jobs-sidebar';
import JobApplicationModal from '@/components/jobs/job-application-modal';
import JobFilterBar from '@/components/jobs/job-filter-bar';

export default function JobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs } = useSelector((state: RootState) => state.job);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [targetJob, setTargetJob] = useState<Job | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const fetchUserApplications = async () => {
    try {
      const res = await jobService.getMyApplications();
      if (res.applications) {
        const ids = res.applications.map((app: { jobId: string; job?: { id: string } }) => app.jobId || app.job?.id);
        setAppliedJobIds(ids);
      }
    } catch {
      console.log('Failed to fetch user applications');
    }
  };

  useEffect(() => {
    dispatch(searchJobsThunk({}));
    Promise.resolve().then(fetchUserApplications);
  }, [dispatch]);

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      Promise.resolve().then(() => setSelectedJob(jobs[0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  const handleFilterChange = (filters: { location: string; role: string; postedWithin: string }) => {
    const query: Record<string, unknown> = {};
    if (filters.location) query.location = filters.location;
    if (filters.role) query.role = filters.role;
    if (filters.postedWithin) query.postedWithin = Number(filters.postedWithin);

    dispatch(searchJobsThunk(query));
  };

  const handleOpenApplyModal = (job: Job) => {
    setTargetJob(job);
    setApplyModalOpen(true);
  };

  const handleApplicationSuccess = (jobId: string) => {
    setAppliedJobIds((prev) => [...prev, jobId]);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 3 }}>
          <JobsSidebar />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <JobFilterBar onFilter={handleFilterChange} />

          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1D2226' }}>
                  Top job picks for you
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Based on your profile, preferences, and activity ({jobs.length} jobs found)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {jobs.map((job) => (
                  <Box
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 2,
                      outline: selectedJob?.id === job.id ? '2px solid #0A66C2' : 'none',
                    }}
                  >
                    <JobCard job={job} isApplied={appliedJobIds.includes(job.id)} onApply={() => handleOpenApplyModal(job)} />
                  </Box>
                ))}

                {jobs.length === 0 && (
                  <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                    No jobs match your filter criteria. Try resetting the filters.
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <JobDetailsPane
                job={selectedJob}
                isApplied={selectedJob ? appliedJobIds.includes(selectedJob.id) : false}
                onOpenApplyModal={handleOpenApplyModal}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <JobApplicationModal open={applyModalOpen} job={targetJob} onClose={() => setApplyModalOpen(false)} onSuccess={handleApplicationSuccess} />
    </Container>
  );
}
