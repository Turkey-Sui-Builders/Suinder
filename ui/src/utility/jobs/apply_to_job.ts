// src/utility/jobs/apply_to_job.ts
import { Transaction } from "@mysten/sui/transactions";

export function applyToJobTx(packageId: string, jobId: string, cover: string) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::job_board::job_board::apply_to_job`,
    arguments: [
      tx.object(jobId),
      tx.pure.string(cover),
    ],
  });

  return tx;
}