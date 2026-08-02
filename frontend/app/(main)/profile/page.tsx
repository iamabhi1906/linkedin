'use client';

import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { CameraAlt as CameraIcon, Edit as EditIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchMeThunk, updateProfileThunk } from '@/features/user/user.slice';
import { userService } from '@/services/users/user.service';
import { useSnackbar } from 'notistack';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const { profile } = useSelector((state: RootState) => state.user);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const { data: session } = useSession();

  const currentUser = profile || authUser || session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setHeadline(currentUser.headline || '');
      setAbout(currentUser.about || '');
      setLocation(currentUser.location || '');
    }
  }, [currentUser]);

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await userService.uploadProfilePicture(e.target.files[0]);
        dispatch(fetchMeThunk());
        enqueueSnackbar('Profile picture updated!', { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to update profile picture', { variant: 'error' });
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfileThunk({ headline, about, location })).unwrap();
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
      setIsEditing(false);
    } catch {
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="md">
      <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, mb: 3, overflow: 'hidden' }}>
        {/* Cover Image Header */}
        <Box sx={{ height: 160, background: 'linear-gradient(135deg, #004182 0%, #0A66C2 100%)', position: 'relative' }}>
          <label htmlFor="cover-upload">
            <input id="cover-upload" type="file" accept="image/*" style={{ display: 'none' }} />
            <IconButton component="span" sx={{ position: 'absolute', top: 12, right: 12, color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <CameraIcon />
            </IconButton>
          </label>
        </Box>

        <CardContent sx={{ position: 'relative', pt: 0 }}>
          {/* Avatar with Camera Icon */}
          <Box sx={{ position: 'relative', display: 'inline-block', mt: '-60px', mb: 2 }}>
            <Avatar
              src={currentUser?.profilePicture}
              sx={{ width: 120, height: 120, border: '4px solid #FFFFFF', fontSize: '2.5rem', backgroundColor: '#0A66C2' }}
            >
              {currentUser?.firstName?.[0] || currentUser?.name?.[0] || 'U'}
            </Avatar>
            <label htmlFor="profile-pic-upload">
              <input id="profile-pic-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePictureUpload} />
              <IconButton component="span" sx={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0', '&:hover': { backgroundColor: '#F3F2EF' } }}>
                <CameraIcon fontSize="small" />
              </IconButton>
            </label>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : currentUser?.name || 'User'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {currentUser?.headline || 'Add a headline'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {currentUser?.location || 'Location not specified'} • {currentUser?.email}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600 }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </Box>

          {isEditing && (
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E0E0E0' }}>
              <TextField fullWidth label="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} margin="normal" size="small" />
              <TextField fullWidth label="Location" value={location} onChange={(e) => setLocation(e.target.value)} margin="normal" size="small" />
              <TextField fullWidth multiline rows={3} label="About" value={about} onChange={(e) => setAbout(e.target.value)} margin="normal" size="small" />
              <Button variant="contained" onClick={handleSaveProfile} sx={{ mt: 1.5, borderRadius: 5, textTransform: 'none', fontWeight: 600 }}>
                Save Changes
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* About Section */}
      <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          About
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentUser?.about || 'No description provided yet.'}
        </Typography>
      </Card>
    </Container>
  );
}
