import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { organizationService } from '@/services/organizations/organization.service';
import { CreateOrgPayload, Organization } from './organization.type';
import axios from 'axios';

export const fetchOrganizationsThunk = createAsyncThunk('organization/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await organizationService.getAll();
    return data.organizations as Organization[];
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch organizations');
    }
    return rejectWithValue('Failed to fetch organizations');
  }
});

export const createOrganizationThunk = createAsyncThunk('organization/create', async (payload: CreateOrgPayload, { rejectWithValue }) => {
  try {
    const data = await organizationService.create(payload);
    return data.organization as Organization;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create organization');
    }
    return rejectWithValue('Failed to create organization');
  }
});

interface OrganizationState {
  organizations: Organization[];
  currentOrg: Organization | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  currentOrg: null,
  loading: false,
  error: null,
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setCurrentOrg: (state, action) => {
      state.currentOrg = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrganizationThunk.fulfilled, (state, action) => {
        state.organizations.unshift(action.payload);
      });
  },
});

export const { setCurrentOrg } = organizationSlice.actions;
export default organizationSlice.reducer;
