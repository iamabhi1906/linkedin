'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import { organizationService } from '@/services/organizations/organization.service';
import { Organization } from '@/features/organization/organization.type';

export default function OrganizationDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      organizationService
        .getBySlug(slug)
        .then((res) => setOrg(res.organization))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return null;
  if (!org) return <Typography sx={{ p: 4 }}>Organization not found</Typography>;

  return (
    <Container maxWidth="md">
      <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ height: 160, background: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)' }} />
        <CardContent sx={{ pt: 0 }}>
          <Avatar src={org.logo || undefined} sx={{ width: 100, height: 100, border: '4px solid #FFFFFF', mt: '-50px', mb: 2, backgroundColor: '#0A66C2' }}>
            <BusinessIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {org.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {org.tagline || 'Company Page'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {org.industry} • {org.location} • {org.website}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {org.about}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
