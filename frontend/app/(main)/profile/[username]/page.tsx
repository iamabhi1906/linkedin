'use client';

import { useParams } from 'next/navigation';
import UserProfileView from '@/components/profile/user-profile-view';

export default function UserProfileByIdOrUsernamePage() {
  const params = useParams();
  const username = typeof params.username === 'string' ? params.username : Array.isArray(params.username) ? params.username[0] : '';

  return <UserProfileView username={username} />;
}
