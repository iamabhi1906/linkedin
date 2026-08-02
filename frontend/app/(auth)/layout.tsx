import LinkedInLogo from '@/components/linkedin-logo';
import { Container } from '@mui/material';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="xl">
      <LinkedInLogo height={50} width={250} />
      {children}
    </Container>
  );
}
