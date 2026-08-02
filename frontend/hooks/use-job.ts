import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { searchJobsThunk, createJobThunk } from '@/features/job/job.slice';
import { JobSearchQuery, CreateJobPayload } from '@/services/jobs/job.service';

export function useJob() {
  const dispatch = useDispatch<AppDispatch>();
  const jobState = useSelector((state: RootState) => state.job);

  const searchJobs = (query: JobSearchQuery) => dispatch(searchJobsThunk(query));
  const createJob = (payload: CreateJobPayload) => dispatch(createJobThunk(payload));

  return {
    ...jobState,
    searchJobs,
    createJob,
  };
}
