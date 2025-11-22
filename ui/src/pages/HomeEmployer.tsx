// src/pages/HomeEmployer.tsx
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import SwipeCard from "../components/SwipeCard";
import { fetchEmployerApplications, type ApplicationInfo } 
  from "../utility/jobs/fetch_applications";

export default function HomeEmployer() {
  const client = useSuiClient();
  const account = useCurrentAccount();

  const [applications, setApplications] = useState<ApplicationInfo[]>([]);

  useEffect(() => {
    if (!account) return;

    fetchEmployerApplications(client, account.address).then((apps) => {
      setApplications(apps);
    });
  }, [account]);

  if (!applications.length) return <p>No applications yet.</p>;

  return (
    <>
      {applications.map((app) => (
        <SwipeCard key={app.objectId} type="application" data={app} />
      ))}
    </>
  );
}