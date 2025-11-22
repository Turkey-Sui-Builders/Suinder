// src/components/MeActions.tsx
import { useState } from "react";
import { Card, Button, Flex } from "@radix-ui/themes";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { postJobTx } from "../utility/jobs/post_job";
import { becomeEmployerTx } from "../utility/jobs/become_employer";
import { useNetworkVariables } from "../networkConfig";

interface MeActionsProps {
  isEmployer: boolean;
}

export default function MeActions({ isEmployer }: MeActionsProps) {
  const { packageId, jobBoardId } = useNetworkVariables();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  //
  // INPUT FIELD
  //
  function InputField(props: {
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) {
    return (
      <input
        {...props}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #333",
          background: "#111",
          color: "white",
          fontSize: "14px",
        }}
      />
    );
  }

  //
  // EMPLOYER – POST JOB
  //
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  async function submitJob() {
    await signAndExecute({
      transaction: postJobTx(
        packageId,
        jobBoardId,
        title,
        company,
        location,
        salary ? Number(salary) : null,
        description
      ),
    });

    alert("Job posted successfully!");

    setTitle("");
    setCompany("");
    setLocation("");
    setSalary("");
    setDescription("");
  }

  //
  // CANDIDATE – SAVE COVER LETTER
  //
  const [cover, setCover] = useState(
    localStorage.getItem("candidate_cover_letter") ?? ""
  );

  function saveCover() {
    localStorage.setItem("candidate_cover_letter", cover);
    alert("Cover letter saved!");
  }

  //
  // BECOME EMPLOYER
  //
  async function becomeEmployer() {
    await signAndExecute({
      transaction: becomeEmployerTx(packageId),   // ✅ FIXED — Only 1 arg
    });

    alert("You are now an employer! Refresh the page.");
  }

  //
  // UI
  //
  return (
    <Card size="4" style={{ padding: 20, marginBottom: 20 }}>
      {isEmployer ? (
        <>
          <h3>Post a New Job</h3>

          <Flex direction="column" gap="3" style={{ marginTop: 10 }}>
            <InputField
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <InputField
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <InputField
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <InputField
              placeholder="Salary (optional)"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />

            <textarea
              placeholder="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                height: 100,
                padding: 10,
                borderRadius: 8,
                background: "#111",
                border: "1px solid #333",
                color: "white",
              }}
            />

            <Button onClick={submitJob}>Post Job</Button>
          </Flex>
        </>
      ) : (
        <>
          <h3>Your Application Template</h3>

          <textarea
            placeholder="Write your cover letter..."
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            style={{
              width: "100%",
              height: 120,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #333",
              background: "#111",
              color: "white",
            }}
          />

          <Button onClick={saveCover} style={{ marginTop: 10 }}>
            Save Application
          </Button>

          {/* Become Employer Button */}
          <Button
            color="yellow"
            style={{ marginTop: 20 }}
            onClick={becomeEmployer}
          >
            Become Employer
          </Button>
        </>
      )}
    </Card>
  );
}