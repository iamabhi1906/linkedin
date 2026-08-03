'use client';

import React from 'react';
import { Avatar, Box, Button, Divider, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './job-details-pane.module.css';
import { Job } from '@/features/job/job.type';

interface JobDetailsPaneProps {
  job: Job | null;
  isApplied: boolean;
  onOpenApplyModal: (job: Job) => void;
}

export default function JobDetailsPane({
  job,
  isApplied,
  onOpenApplyModal,
}: JobDetailsPaneProps) {
  if (!job) {
    return (
      <Box className={styles.container} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Select a job to view details</Typography>
      </Box>
    );
  }

  const orgName = job.organization?.name || 'Company';
  const orgLogo = job.organization?.logo;
  const packageText = job.packageOffered || job.salaryRange || '₹ Negotiable';

  return (
    <Box className={styles.container}>
      <Box className={styles.companyRow}>
        {orgLogo ? (
          <Avatar src={orgLogo} variant="rounded" className={styles.logo} />
        ) : (
          <Avatar variant="rounded" className={styles.logo} sx={{ backgroundColor: '#EDF3F8', color: '#0A66C2' }}>
            <WorkIcon />
          </Avatar>
        )}
        <Box>
          <Typography className={styles.jobTitle}>{job.title}</Typography>
          <Typography className={styles.companyName}>{orgName}</Typography>
          <Typography className={styles.locationText}>
            {job.location || 'Remote'} • {new Date(job.createdAt).toLocaleDateString()} • {job.applicationsCount || 0} applicants
          </Typography>
        </Box>
      </Box>

      <Box className={styles.metaRow}>
        <Typography component="span" className={styles.typeBadge}>
          {job.workplaceType || 'On-site'}
        </Typography>
        <Typography component="span" className={styles.typeBadge}>
          {job.jobType || 'Full-time'}
        </Typography>
        {job.role && (
          <Typography component="span" className={styles.typeBadge}>
            Role: {job.role}
          </Typography>
        )}
        {job.experienceNeeded && (
          <Typography component="span" className={styles.typeBadge}>
            Exp: {job.experienceNeeded}
          </Typography>
        )}
        <Typography component="span" className={styles.typeBadge} sx={{ color: '#137333 !important', borderColor: '#137333 !important' }}>
          Package: {packageText.includes('₹') ? packageText : `₹ ${packageText}`}
        </Typography>
      </Box>

      <Box className={styles.btnRow}>
        {isApplied ? (
          <Button disabled variant="contained" className={styles.appliedBtn} startIcon={<CheckCircleIcon />}>
            Applied
          </Button>
        ) : (
          <Button
            variant="contained"
            className={styles.applyBtn}
            onClick={() => onOpenApplyModal(job)}
          >
            Easy Apply
          </Button>
        )}
        <Button variant="outlined" className={styles.saveBtn}>
          Save
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography className={styles.sectionHeader}>About the job</Typography>
      <Typography className={styles.descriptionBody}>{job.description}</Typography>
    </Box>
  );
}
