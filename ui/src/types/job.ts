export interface JobInfo {
  objectId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: number | null;
  status: number;
  hired_candidate: string | null;
  jobId: string;
}