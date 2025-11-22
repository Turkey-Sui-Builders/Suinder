// src/utility/jobs/fetch_owned_caps.ts
import { SuiClient } from "@mysten/sui/client";

export interface EmployerCapInfo {
  objectId: string;
  owner: string;
  job_id: string;
}

export async function fetchOwnedCaps(
  client: SuiClient,
  owner: string,
  packageId: string
): Promise<EmployerCapInfo[]> {
  const res = await client.getOwnedObjects({
    owner,
    filter: {
      StructType: `${packageId}::job_board::EmployerCap`,
    },
    options: {
      showContent: true,
    },
  });

  return res.data
    .map((obj) => {
      const content = obj.data?.content;

      if (content?.dataType !== "moveObject") return null;

      const fields = content.fields as any;

      return {
        objectId: obj.data!.objectId,
        owner: fields.owner,
        job_id: fields.job_id,
      };
    })
    .filter(Boolean) as EmployerCapInfo[];
}