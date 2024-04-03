"use client";

import ContextBar from "@/components/ContextBar";
import ObjectiveQuestion from "@/components/ObjectiveQuestion";
import {
  Button,
  Input,
  Tab,
  TabDetail,
  TabHeader,
  Tabs,
  Textarea,
  ThemeType,
} from "basicui";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.css";
import { Assessment } from "@/types/Assessment";
import { deleteAssessmentById, getAssessmentById, saveAssessmentById } from "./service";

const sampleData = require("./data.json");

export default function AssessmentPage() {
  const [assessmentData, setAssessmentData] = useState<Assessment>({
    name: "",
  });
  const [state, setState] = useState<any>({ ...sampleData });
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAssessmentDataChange = (event: any) => {
    setAssessmentData({
      ...assessmentData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleQuestionChange = (data: any) => {
    console.log(data);
  };

  const saveAssessment = () => {
    saveAssessmentById(assessmentData?.id || "", assessmentData).then(
      (response) => {
        fetchAssessmentById();
      }
    );
  };

  const handleDeleteAssessment = () => {
    deleteAssessmentById(assessmentData?.id || "").then(
      (response) => {
        router.back();
      }
    );
  }

  const [tab, setTab] = useState("1");

  const handleTabChange = (_tab: string) => {
    setTab(_tab);
  };

  useEffect(() => {
    if (searchParams.has("id")) {
      fetchAssessmentById();
    }
  }, [searchParams]);

  const fetchAssessmentById = () => {
    getAssessmentById(searchParams.get("id") || "").then((response) => {
      setAssessmentData(response);
    });
  };

  return (
    <div>
      <ContextBar title={assessmentData.name}>
        <Button onClick={saveAssessment} theme={ThemeType.primary}>
          Save
        </Button>
        <Button onClick={handleDeleteAssessment} theme={ThemeType.danger}>
          Delete
        </Button>
        <Button onClick={saveAssessment}>Close</Button>
      </ContextBar>
      <div className="page">
        <Tabs activeTabId={tab} onChange={handleTabChange}>
          <Tab id="1">
            <TabHeader>Details</TabHeader>
            <TabDetail>
              <form className="assessment-detail-form">
                <Input
                  label="Assessment name"
                  name="name"
                  value={assessmentData?.name}
                  onInput={handleAssessmentDataChange}
                />
                <Textarea
                  label="Job description"
                  name="jobDescription"
                  value={assessmentData?.jobDescription}
                  onInput={handleAssessmentDataChange}
                />
              </form>
            </TabDetail>
          </Tab>
          <Tab id="2">
            <TabHeader>Questions</TabHeader>
            <TabDetail>
              <div className="assessment-questions">
                {state.questions.map((item: any, index: number) => (
                  <ObjectiveQuestion
                    onChange={handleQuestionChange}
                    key={item.question}
                    question={item}
                    index={index}
                  />
                ))}
              </div>
            </TabDetail>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
