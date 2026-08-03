'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { updateProfileThunk } from '@/features/user/user.action';
import { useSnackbar } from 'notistack';
import { updateProfileSchema, UpdateProfileFormValues } from '@/features/user/profile.schema';
import styles from './edit-profile-modal.module.css';
import { User } from '@/features/user/user.type';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export default function EditProfileModal({ open, onClose, currentUser }: EditProfileModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: currentUser?.name || '',
      headline: currentUser?.headline || '',
      location: currentUser?.location || '',
      about: currentUser?.about || '',
    },
  });

  const onSubmit = async (data: UpdateProfileFormValues) => {
    try {
      await dispatch(updateProfileThunk(data)).unwrap();
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
      onClose();
    } catch (err: unknown) {
      enqueueSnackbar((err as Error).message || 'Failed to update profile', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { className: styles.dialogPaper } }}>
      <DialogTitle component="div" className={styles.headerRow}>
        <Typography className={styles.headerTitle}>Edit intro</Typography>
        <IconButton onClick={onClose} className={styles.cancelBtn}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="edit-profile-form" className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Full Name *" size="small" error={!!errors.name} helperText={errors.name?.message} />
            )}
          />

          <Controller
            name="headline"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={2}
                label="Headline"
                placeholder="e.g. Full Stack Developer Intern"
                size="small"
                error={!!errors.headline}
                helperText={errors.headline?.message}
              />
            )}
          />

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Location"
                placeholder="e.g. Mohali, Punjab, India"
                size="small"
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            )}
          />

          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Website URL"
                placeholder="https://www.iamabhi.dev"
                size="small"
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            )}
          />

          <Controller
            name="about"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                label="About / Bio"
                placeholder="Write a brief overview of your skills and career history..."
                size="small"
                error={!!errors.about}
                helperText={errors.about?.message}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} className={styles.cancelBtn}>
          Cancel
        </Button>
        <Button type="submit" form="edit-profile-form" variant="contained" className={styles.saveBtn} disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
