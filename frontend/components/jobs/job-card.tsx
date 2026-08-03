'use client';

import React from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './job-card.module.css';
import { Job } from '@/features/job/job.type';

interface JobCardProps {
  job: Job;
  isApplied: boolean;
  onApply: (jobId: string) => void;
}

export default function JobCard({ job, isApplied, onApply }: JobCardProps) {
  const orgName = job.organization?.name || 'Company';
  const orgLogo = job.organization?.logo;
  const roleText = job.role || 'Software Engineering';
  const expText = job.experienceNeeded || '0 - 2 Years';
  const packageText = job.packageOffered || job.salaryRange || '₹ Negotiable';
  const locationText = job.location || 'Remote (India)';

  return (
    <Box className={styles.card}>
      <Box>
        <Box className={styles.headerRow}>
          {orgLogo ? (
            <Avatar src={orgLogo} variant="rounded" className={styles.iconBox} />
          ) : (
            <Box className={styles.iconBox}>
              <WorkIcon />
            </Box>
          )}

          <Box>
            <Typography className={styles.title}>{job.title}</Typography>
            <Typography className={styles.orgName}>
              {orgName} • {locationText}
            </Typography>
          </Box>
        </Box>

        <Box className={styles.metaChipsRow}>
          <Typography component="span" className={styles.roleChip}>
            {roleText}
          </Typography>
          <Typography component="span" className={styles.expChip}>
            Exp: {expText}
          </Typography>
          <Typography component="span" className={styles.packageChip}>
            Package: {packageText.includes('₹') ? packageText : `₹ ${packageText}`}
          </Typography>
        </Box>

        <Typography className={styles.description}>{job.description}</Typography>
      </Box>

      {isApplied ? (
        <Button
          disabled
          variant="contained"
          className={styles.appliedButton}
          startIcon={<CheckCircleIcon />}
        >
          Applied
        </Button>
      ) : (
        <Button
          variant="contained"
          className={styles.applyButton}
          onClick={(e) => {
            e.stopPropagation();
            onApply(job.id);
          }}
        >
          Easy Apply
        </Button>
      )}
    </Box>
  );
}
