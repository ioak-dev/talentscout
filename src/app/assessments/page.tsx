"use client";

import ContextBar from "@/components/ContextBar";
import { Button } from "basicui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAssessments } from "./service";

export default function Assessments() {
  const router = useRouter();
  const newAssessment = () => {};

  const manageAssessment = (id: string) => {
    router.push(`/assessment?id=${id}`);
  };

  const handleKeydown = (event: any, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      manageAssessment(id);
    }
  };

  useEffect(() => {
    getAssessments().then((response: any) => {
      if (response?.results) {
        console.log(response?.results);
      }
    });
  }, []);

  return (
    <div>
      <ContextBar title="Assessments list">
        <Button onClick={newAssessment}>New assessment</Button>
      </ContextBar>
      <div className="page">
        <table className="basicui-table">
          <thead>
            <tr>
              <th>Assessment name</th>
              <th>Created on</th>
              <th>Status</th>
              <th>Assessment Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr
              tabIndex={0}
              onClick={() => manageAssessment("1")}
              onKeyDown={(event) => handleKeydown(event, "1")}
            >
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
            </tr>
            <tr
              tabIndex={0}
              onClick={() => manageAssessment("2")}
              onKeyDown={(event) => handleKeydown(event, "2")}
            >
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
            </tr>
            <tr
              tabIndex={0}
              onClick={() => manageAssessment("3")}
              onKeyDown={(event) => handleKeydown(event, "3")}
            >
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
