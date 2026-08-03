'use client';

import React, { useState } from 'react';
import { Box, Button, Card, InputAdornment, MenuItem, TextField } from '@mui/material';
import LocationIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './job-filter-bar.module.css';

interface JobFilterBarProps {
  onFilter: (filters: { location: string; role: string; postedWithin: string }) => void;
}

export default function JobFilterBar({ onFilter }: JobFilterBarProps) {
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');
  const [postedWithin, setPostedWithin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ location, role, postedWithin });
  };

  const handleReset = () => {
    setLocation('');
    setRole('');
    setPostedWithin('');
    onFilter({ location: '', role: '', postedWithin: '' });
  };

  return (
    <Card elevation={0} className={styles.card}>
      <Box component="form" onSubmit={handleSubmit} className={styles.filterForm}>
        <TextField
          className={styles.inputField}
          size="small"
          label="Location"
          placeholder="e.g. Bengaluru, Remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon sx={{ color: '#666666', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          className={styles.inputField}
          size="small"
          label="Job Role"
          placeholder="e.g. Software Engineer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <WorkIcon sx={{ color: '#666666', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          className={styles.selectField}
          size="small"
          label="Date Posted"
          value={postedWithin}
          onChange={(e) => setPostedWithin(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon sx={{ color: '#666666', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        >
          <MenuItem value="">Any time</MenuItem>
          <MenuItem value="24">Past 24 hours</MenuItem>
          <MenuItem value="48">Past 48 hours</MenuItem>
          <MenuItem value="72">Past 72+ hours</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" className={styles.searchBtn}>
          Filter Jobs
        </Button>

        {(location || role || postedWithin) && (
          <Button onClick={handleReset} className={styles.resetBtn}>
            Reset
          </Button>
        )}
      </Box>
    </Card>
  );
}
