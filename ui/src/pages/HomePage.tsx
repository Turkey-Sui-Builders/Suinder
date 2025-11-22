// src/pages/HomePage.tsx
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import HomeEmployer from "./HomeEmployer";
import HomeCandidate from "./HomeCandidate";
import { fetchOwnedCaps } from "../utility/jobs/fetch_owned_caps";
import { useEffect, useState } from "react";
import { useNetworkVariables } from "../networkConfig";
import { becomeEmployerTx } from "../utility/jobs/become_employer";
import { Button, Card } from "@radix-ui/themes";

export default function HomePage() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const { packageId, jobBoardId } = useNetworkVariables();

  const [isEmployer, setIsEmployer] = useState<boolean | null>(null);

  useEffect(() => {
    if (!account) return;

    fetchOwnedCaps(client, account.address, packageId).then((caps) => {
      setIsEmployer(caps.length > 0);
    });
  }, [account, packageId]);

  if (!account) return <p>Please connect wallet.</p>;
  if (isEmployer === null) return <p>Loading...</p>;

  //
  // If user is NOT an employer → show onboarding button
  //
  if (!isEmployer) {
    return (
      <Card size="4" style={{ padding: 20, margin: 20 }}>
        <h2>You are a Candidate</h2>
        <p>You can swipe jobs and apply.  
        Or become an employer to post jobs.</p>

        <Button
  onClick={async () => {
    await signAndExecute({
      transaction: becomeEmployerTx(packageId),   // ✅ FIXED
    });

    alert("You are now an employer!");
    window.location.reload();
  }}
  style={{ marginTop: 12 }}
>
  Become Employer
</Button>
        {/* Candidate Home */}
        <div style={{ marginTop: 30 }}>
          <HomeCandidate />
        </div>
      </Card>
    );
  }

  //
  // User is employer → show employer dashboard
  //
  return <HomeEmployer />;
}