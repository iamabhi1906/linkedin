'use client';
import { Box, Card, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import styles from './profile-about-card.module.css';

interface ProfileAboutCardProps {
  about: string | null | undefined;
  onEdit?: () => void;
  isOwnProfile?: boolean;
}

export default function ProfileAboutCard({ about, onEdit, isOwnProfile = true }: ProfileAboutCardProps) {
  return (
    <Card elevation={0} className={styles.card}>
      <Box className={styles.headerRow}>
        <Typography className={styles.title}>About</Typography>
        {isOwnProfile && onEdit && (
          <IconButton className={styles.editBtn} onClick={onEdit}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Typography className={styles.aboutText}>
        {about || (isOwnProfile ? 'Add an about section to tell people about your background and experience.' : 'No about section provided.')}
      </Typography>
    </Card>
  );
}
