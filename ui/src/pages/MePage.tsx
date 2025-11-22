// src/pages/MePage.tsx
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import MeActions from "../components/MeActions";
import type { JobInfo } from "../types/job";

import { fetchOwnedJobs } from "../utility/jobs/fetch_all_jobs";
import { fetchOwnedCaps } from "../utility/jobs/fetch_owned_caps";
import { useNetworkVariables } from "../networkConfig";

export default function MePage() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { packageId } = useNetworkVariables();

  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [isEmployer, setIsEmployer] = useState<boolean | null>(null);

  useEffect(() => {
    if (!account) return;

    // 1. Check if user owns EmployerCaps → they are employer
    fetchOwnedCaps(client, account.address, packageId).then((caps) =>
      setIsEmployer(caps.length > 0)
    );

    // 2. Load employer jobs
    fetchOwnedJobs(client, account.address, packageId).then((data) =>
      setJobs(data)
    );
  }, [account, packageId]);

  if (!account) return <p>Please connect wallet.</p>;
  if (isEmployer === null) return <p>Loading...</p>;

  return (
    <>
      <h2>Your Dashboard</h2>

      {/* 🔥 Post job OR save application template */}
      <MeActions isEmployer={isEmployer} />

      {/* EMPLOYER ONLY: show their job list */}
      {isEmployer && (
        <>
          {!jobs.length && <p>You have no job postings yet.</p>}

          {jobs.map((job) => (
            <div
              key={job.objectId}
              style={{
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "1px solid #333",
              }}
            >
              <h3>{job.title}</h3>
              <p>Status: {job.status === 1 ? "Closed" : "Open"}</p>

              {job.hired_candidate && (
                <p>
                  <strong>Hired:</strong> {job.hired_candidate}
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {/* CANDIDATE: No job list (only application template above) */}
      {!isEmployer && (
        <p style={{ marginTop: "16px", opacity: 0.7 }}>
          You are browsing jobs. Swipe right to apply.
        </p>
      )}
    </>
  );
}