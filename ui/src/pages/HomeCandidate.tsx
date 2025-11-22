import { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import SwipeCard from "../components/SwipeCard";
import { fetchAllJobs } from "../utility/jobs/fetch_all_jobs";
import type { JobInfo } from "../types/job";

export default function HomeCandidate() {
  const client = useSuiClient();
  const [jobs, setJobs] = useState<JobInfo[]>([]);

  useEffect(() => {
    fetchAllJobs(client).then((data) => setJobs(data));
  }, []);

  if (!jobs.length) return <p>No jobs posted yet.</p>;

  return (
    <>
      {jobs.map((job) => (
        <SwipeCard key={job.objectId} type="job" data={job} />
      ))}
    </>
  );
}