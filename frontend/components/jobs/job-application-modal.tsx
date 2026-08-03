'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { jobService } from '@/services/jobs/job.service';
import { useSnackbar } from 'notistack';
import { Job } from '@/features/job/job.type';
import { jobApplicationSchema, JobApplicationFormValues } from '@/features/job/job-application.schema';
import styles from './job-application-modal.module.css';

interface JobApplicationModalProps {
  open: boolean;
  job: Job | null;
  onClose: () => void;
  onSuccess: (jobId: string) => void;
}

export default function JobApplicationModal({ open, job, onClose, onSuccess }: JobApplicationModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { profile } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const currentUser = profile || user;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    values: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: (currentUser as { phone?: string })?.phone || '',
      coverLetter: '',
    },
  });

  if (!job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileError(null);
    }
  };

  const onSubmit = async (data: JobApplicationFormValues) => {
    if (!selectedFile) {
      setFileError('CV / Resume file is required');
      return;
    }

    setSubmitting(true);
    try {
      await jobService.apply(job.id, data.coverLetter, data.phone, data.email, selectedFile, data.name);
      enqueueSnackbar('Application submitted successfully!', { variant: 'success' });
      onSuccess(job.id);
      reset();
      setSelectedFile(null);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit application';
      if ((err as { response?: { status?: number } })?.response?.status === 409 || msg.includes('already applied')) {
        enqueueSnackbar('You have already applied for this job!', { variant: 'info' });
        onSuccess(job.id);
        onClose();
      } else {
        enqueueSnackbar(msg, { variant: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { className: styles.dialogPaper } }}>
      <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography className={styles.headerTitle}>Easy Apply to {job.organization?.name || 'Company'}</Typography>
          <Typography className={styles.headerSubtitle}>{job.title}</Typography>
        </Box>
        <IconButton onClick={onClose} className={styles.closeBtn}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" className={styles.formBox} id="job-apply-form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1D2226' }}>
            Contact Information
          </Typography>

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Full Name *"
                placeholder="John Doe"
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email Address *"
                placeholder="john@example.com"
                size="small"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone Number *"
                placeholder="+91 98765 43210"
                size="small"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1D2226', mt: 1 }}>
            Resume / CV *
          </Typography>

          <Box className={styles.fileUploadBox} component="label">
            <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileChange} />
            <CloudUploadIcon sx={{ fontSize: 36, color: '#0A66C2', mb: 0.5 }} />
            <Typography className={styles.fileUploadText}>{selectedFile ? 'Change Resume / CV' : 'Upload Resume / CV (PDF, DOCX)'}</Typography>
            <Typography className={styles.fileUploadSubtext}>DOC, DOCX, PDF (MAX. 5MB)</Typography>

            {selectedFile && <Typography className={styles.selectedFileName}>Selected: {selectedFile.name}</Typography>}
          </Box>

          {fileError && <Alert severity="error">{fileError}</Alert>}

          <Controller
            name="coverLetter"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label="Cover Letter / Note to Hiring Manager (Optional)"
                placeholder="Explain why you are a great fit for this role..."
                size="small"
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ color: '#666666', textTransform: 'none' }}>
          Cancel
        </Button>
        <Button type="submit" form="job-apply-form" variant="contained" className={styles.submitBtn} disabled={submitting}>
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
