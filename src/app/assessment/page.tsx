"use client";

import ContextBar from "@/components/ContextBar";
import ObjectiveQuestion from "@/components/ObjectiveQuestion";
import {
  Button,
  Tab,
  TabDetail,
  TabHeader,
  Tabs,
  Textarea,
  ThemeType
} from "basicui";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import "./style.css";

const sampleData = require("./data.json");
console.log(sampleData);

export default function Assessment() {
  const [state, setState] = useState<any>({ ...sampleData });
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (event: any) => {
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleQuestionChange = (data: any) => {
    console.log(data);
  };

  const saveAssessment = () => {
    console.log(state);
  };

  const [tab, setTab] = useState("1");

  const handleTabChange = (_tab: string) => {
    setTab(_tab);
  };

  return (
    <div>
      <ContextBar title={searchParams.get("id") || ""}>
        <Button onClick={saveAssessment} theme={ThemeType.primary}>
          Save
        </Button>
        <Button onClick={saveAssessment} theme={ThemeType.danger}>
          Delete
        </Button>
        <Button onClick={saveAssessment}>Close</Button>
      </ContextBar>
      <div className="page">
        <Tabs activeTabId={tab} onChange={handleTabChange}>
          <Tab id="1">
            <TabHeader>Details</TabHeader>
            <TabDetail>
              <form>
                <Textarea
                  label="Job description"
                  name="jobDescription"
                  value={state.jobDescription}
                  onInput={handleChange}
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
