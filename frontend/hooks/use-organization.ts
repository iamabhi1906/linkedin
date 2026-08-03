import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchOrganizationsThunk, createOrganizationThunk, setCurrentOrg } from '@/features/organization/organization.slice';
import { CreateOrgPayload } from '@/services/organizations/organization.service';
import { Organization } from '@/features/organization/organization.type';

export function useOrganization() {
  const dispatch = useDispatch<AppDispatch>();
  const orgState = useSelector((state: RootState) => state.organization);

  const fetchOrganizations = () => dispatch(fetchOrganizationsThunk());
  const createOrganization = (payload: CreateOrgPayload) => dispatch(createOrganizationThunk(payload));
  const selectOrg = (org: Organization | null) => dispatch(setCurrentOrg(org));

  return {
    ...orgState,
    fetchOrganizations,
    createOrganization,
    selectOrg,
  };
}
