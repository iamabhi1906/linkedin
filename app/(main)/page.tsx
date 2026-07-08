import Image from 'next/image';
import { Box, Container, Stack, Typography } from '@mui/material';
import Navbar from '@/components/navbar';
import heroIllustration from '@/public/hero-illustration.svg';
import styles from '@/app/page.module.css';

export default function Home() {
  return (
    <Container className={styles.page}>
      <Stack direction={'row'}>
        <Stack>
          <Typography variant="h4">Find jobs, connections, insights and more to grow your career</Typography>
        </Stack>
        <Image src={heroIllustration} alt="Hero_Illustration" width={600} />
      </Stack>
    </Container>
  );
}
