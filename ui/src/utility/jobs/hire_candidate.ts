// src/utility/jobs/hire_candidate.ts
import { Transaction } from "@mysten/sui/transactions";

export function hireCandidateTx(
  packageId: string,
  jobId: string,
  employerCapId: string,
  applicationId: string
) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::job_board::hire_candidate`,
    arguments: [
      tx.object(jobId),
      tx.object(employerCapId),
      tx.object(applicationId),
    ],
  });

  return tx;
}