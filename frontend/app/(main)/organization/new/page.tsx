'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { createOrganizationThunk } from '@/features/organization/organization.slice';
import { useSnackbar } from 'notistack';
import { CreateOrgPayload } from '@/features/organization/organization.type';
import { FormInput } from '@/components/forms/form-input';

export default function CreateOrganizationPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, control } = useForm<CreateOrgPayload>({
    defaultValues: {
      name: '',
      tagline: '',
      about: '',
      website: '',
      industry: '',
      location: '',
    },
  });

  const onSubmit = async (data: CreateOrgPayload) => {
    try {
      const org = await dispatch(createOrganizationThunk(data)).unwrap();
      enqueueSnackbar('Organization page created!', { variant: 'success' });
      router.push(`/organization/${org.slug}`);
    } catch (err: unknown) {
      enqueueSnackbar((err as { message?: string }).message || 'Invalid credentials', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Card elevation={0} sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Create a LinkedIn Page
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput fullWidth label="Page Name" name="name" control={control} size="small" />
            <FormInput fullWidth label="Tagline" name="tagline" control={control} size="small" />
            <FormInput fullWidth multiline rows={3} label="About" name="about" control={control} size="small" />
            <FormInput fullWidth label="Website URL" name="website" control={control} size="small" />
            <FormInput fullWidth label="Industry" name="industry" control={control} size="small" placeholder="Technology, Software, Finance..." />
            <FormInput fullWidth label="Location" name="location" control={control} size="small" />

            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3, borderRadius: 5, textTransform: 'none', fontWeight: 600 }}>
              Create Page
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
