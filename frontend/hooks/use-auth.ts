import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { loginThunk, signupThunk, logoutThunk } from '@/features/auth/auth.action';
import { LoginPayload, SignupPayload } from '@/services/auth/auth.service';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const login = (payload: LoginPayload) => dispatch(loginThunk(payload));
  const signup = (payload: SignupPayload) => dispatch(signupThunk(payload));
  const logout = () => dispatch(logoutThunk());

  return {
    ...authState,
    login,
    signup,
    logout,
  };
}
