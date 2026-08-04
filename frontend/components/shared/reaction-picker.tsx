'use client';

import React from 'react';
import { Box } from '@mui/material';
import { FacebookSelector } from '@charkour/react-reactions';
import styles from './reaction-picker.module.css';

interface ReactionPickerProps {
  onSelect: (reaction: string) => void;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect }) => {
  return (
    <Box className={styles.pickerContainer}>
      <FacebookSelector onSelect={(label: string) => onSelect(label)} />
    </Box>
  );
};
