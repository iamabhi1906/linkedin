'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { fetchMeThunk } from '@/features/user/user.action';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
    if (token || isAuthenticated) {
      dispatch(fetchMeThunk());
    }
  }, [dispatch, accessToken, isAuthenticated]);

  return <>{children}</>;
}
