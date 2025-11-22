// src/utility/jobs/fetch_applications.ts
import {
  SuiClient,
  SuiObjectResponse,
  SuiParsedData,
} from "@mysten/sui/client";

export interface ApplicationInfo {
  objectId: string;
  applicationId: string;
  job_id: string;
  candidate: string;
  cover: string;
  employerCapId: string;
}

/** TRUE type guard: ensures data.content is a Move struct */
function isMoveContent(
  content: SuiParsedData | null | undefined
): content is Extract<SuiParsedData, { dataType: "moveObject" }> {
  return !!content && content.dataType === "moveObject";
}

/** Fetch all employer caps */
async function fetchEmployerCaps(client: SuiClient, employer: string) {
  const res = await client.getOwnedObjects({
    owner: employer,
    filter: { StructType: "job_board::job_board::EmployerCap" },
    options: { showContent: true },
  });

  return res.data
    .map((obj) => {
      const content = obj.data?.content ?? null;
if (!isMoveContent(content)) return null;

const fields = content.fields as any;
      return {
        employerCapId: obj.data!.objectId,
        job_id: fields.job_id as string,
      };
    })
    .filter(Boolean) as { employerCapId: string; job_id: string }[];
}

/** Fetch all application object IDs from events */
async function fetchAllApplicationIds(client: SuiClient): Promise<string[]> {
  const events = await client.queryEvents({
    query: {
      MoveEventType: "job_board::job_board::ApplicationSubmitted",
    },
  });

  return events.data
    .map((e: any) => e.parsedJson?.application_id)
    .filter(Boolean);
}

/** Main: fetch all applications for an employer's jobs */
export async function fetchEmployerApplications(
  client: SuiClient,
  employerAddress: string
): Promise<ApplicationInfo[]> {
  // 1️⃣ Get employer caps (gives job_id → employerCap link)
  const caps = await fetchEmployerCaps(client, employerAddress);

  const appIds = await fetchAllApplicationIds(client);
  if (!appIds.length) return [];

  // 2️⃣ Fetch the actual Application objects
  const apps = await client.multiGetObjects({
    ids: appIds,
    options: { showContent: true },
  });

  // 3️⃣ Filter + extract fields
  return apps
    .map((obj: SuiObjectResponse) => {
      const content = obj.data?.content ?? null;
if (!isMoveContent(content)) return null;

const fields = content.fields as any;
      const jobId = fields.job_id as string;
      const cap = caps.find((c) => c.job_id === jobId);

      if (!cap) return null;

      return {
        objectId: obj.data!.objectId,
        applicationId: obj.data!.objectId,
        job_id: jobId,
        candidate: fields.candidate as string,
        cover: fields.cover as string,
        employerCapId: cap.employerCapId,
      };
    })
    .filter(Boolean) as ApplicationInfo[];
}