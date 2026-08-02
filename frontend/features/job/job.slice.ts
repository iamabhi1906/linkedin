import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jobService, JobSearchQuery, CreateJobPayload } from '@/services/jobs/job.service';

export const searchJobsThunk = createAsyncThunk(
  'job/search',
  async (query: JobSearchQuery, { rejectWithValue }) => {
    try {
      const data = await jobService.search(query);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to search jobs');
    }
  },
);

export const createJobThunk = createAsyncThunk(
  'job/create',
  async (payload: CreateJobPayload, { rejectWithValue }) => {
    try {
      const data = await jobService.create(payload);
      return data.job;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to post job');
    }
  },
);

interface JobState {
  jobs: any[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  total: 0,
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchJobsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchJobsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs || [];
        state.total = action.payload.total || 0;
      })
      .addCase(searchJobsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createJobThunk.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      });
  },
});

export default jobSlice.reducer;
