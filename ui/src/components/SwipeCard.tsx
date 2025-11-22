// src/components/SwipeCard.tsx
import { Card, Button, Flex } from "@radix-ui/themes";
import { applyToJobTx } from "../utility/jobs/apply_to_job";
import { hireCandidateTx } from "../utility/jobs/hire_candidate";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";

// ---- TYPES ----
type SwipeCardType = "job" | "application";

interface JobCardData {
  jobId: string;
  title: string;
  description: string;
}

interface ApplicationCardData {
  job_id: string;
  applicationId: string;
  employerCapId: string;
  cover: string;
}

interface SwipeCardProps {
  type: SwipeCardType;
  data: JobCardData | ApplicationCardData;
}

// ---- COMPONENT ----
export default function SwipeCard({ type, data }: SwipeCardProps) {
  const packageId = useNetworkVariable("packageId");
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  async function handleRightSwipe() {
    if (type === "job") {
      const job = data as JobCardData;

      await signAndExecute({
        transaction: applyToJobTx(packageId, job.jobId, "Hello, I would like to apply!"),
      });

    } else {
      const app = data as ApplicationCardData;

      await signAndExecute({
        transaction: hireCandidateTx(
          packageId,
          app.job_id,
          app.employerCapId,
          app.applicationId
        ),
      });
    }
  }

  return (
    <Card size="3" style={{ marginBottom: "20px" }}>
      <h3>{type === "job" ? (data as JobCardData).title : "Candidate Application"}</h3>

      <p>
        {type === "job"
          ? (data as JobCardData).description
          : (data as ApplicationCardData).cover}
      </p>

      <Flex justify="end" gap="3">
        <Button variant="soft">Skip</Button>
        <Button onClick={handleRightSwipe}>Accept</Button>
      </Flex>
    </Card>
  );
}