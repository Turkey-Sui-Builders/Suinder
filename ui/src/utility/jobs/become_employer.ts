// src/utility/jobs/become_employer.ts
import { Transaction } from "@mysten/sui/transactions";

export function becomeEmployerTx(packageId: string) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::job_board::job_board::become_employer`,
    arguments: [], // correct: no args
  });

  return tx;
}