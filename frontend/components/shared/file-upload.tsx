'use client';

import React, { useRef, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  onUpload: (file: File) => Promise<void>;
  buttonVariant?: 'contained' | 'outlined' | 'text';
}

export function FileUpload({ label = 'Upload File', accept = 'image/*', maxSizeMB = 5, onUpload, buttonVariant = 'outlined' }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onUpload(file);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Box>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} style={{ display: 'none' }} />
      <Button
        variant={buttonVariant}
        startIcon={loading ? <CircularProgress size={18} /> : <UploadIcon />}
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600 }}
      >
        {label}
      </Button>
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
