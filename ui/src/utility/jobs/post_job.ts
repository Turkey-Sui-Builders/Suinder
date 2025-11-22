// src/utility/jobs/post_job.ts
import { Transaction } from "@mysten/sui/transactions";

export function postJobTx(
  packageId: string,
  jobBoardId: string,
  title: string,
  company: string,
  location: string,
  salary: number | null,
  description: string
) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::job_board::job_board::post_job`,
    arguments: [
      tx.object(jobBoardId),              // &mut JobBoard
      tx.pure.string(title),
      tx.pure.string(company),
      tx.pure.string(location),
      tx.pure.option("u64", salary),      // Option<u64>: null → None, number → Some
      tx.pure.string(description),
    ],
  });

  return tx;
}