import { SuiClient } from "@mysten/sui/client";
import type { JobInfo } from "../../types/job";
import { useNetworkVariable } from "../../networkConfig";

export async function fetchAllJobs(client: SuiClient): Promise<JobInfo[]> {
  const res = await client.getOwnedObjects({
    owner: "0x0",
    filter: { StructType: "job_board::job_board::Job" },
    options: { showContent: true, showOwner: true },
  });

  return res.data.map((obj) => ({
    objectId: obj.data?.objectId!,
    ...extractJobData(obj),
  }));
}

export async function fetchOwnedJobs(
  client: SuiClient,
  owner: string,
  packageId: string
): Promise<JobInfo[]> {
  const res = await client.getOwnedObjects({
    owner,
    filter: {
  StructType: `${packageId}::job_board::Job`
},
    options: { showContent: true, showOwner: true },
  });

  return res.data.map((obj) => ({
    objectId: obj.data?.objectId!,
    ...extractJobData(obj),
  }));
}

function extractJobData(obj: any): Omit<JobInfo, "objectId"> {
  const fields = obj.data?.content?.fields;

  return {
    title: fields?.title,
    company: fields?.company,
    location: fields?.location,
    description: fields?.description,
    salary: fields?.salary?.fields?.some ?? null,
    status: fields?.status,
    hired_candidate: fields?.hired_candidate?.fields?.some ?? null,
    jobId: obj.data?.objectId,
  };
}