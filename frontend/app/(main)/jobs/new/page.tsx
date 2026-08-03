'use client';
import { Container } from '@mui/material';
import CreateJobForm from '@/components/jobs/create-job-form';

export default function PostJobPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CreateJobForm />
    </Container>
  );
}
