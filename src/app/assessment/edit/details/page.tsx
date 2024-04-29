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
import { useEffect, useLayoutEffect, useState } from "react";
import "./style.css";
import { Assessment } from "@/types/Assessment";
import {
  deleteAssessmentById,
  getAssessmentById,
  getAssessmentQuestions,
  saveAssessmentById,
  saveAssessmentQuestions,
} from "./service";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { AssessmentQuestion } from "@/types/AssessmentQuestion";

const sampleData = require("./data.json");

const AssessmentPage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});

  const [assessmentData, setAssessmentData] = useState<Assessment>({
    name: "",
  });

  const [assessmentQuestionsData, setAssessmentQuestionsData] = useState<
    AssessmentQuestion[]
  >([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  const handleAssessmentDataChange = (event: any) => {
    setAssessmentData({
      ...assessmentData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleQuestionChange = (event: AssessmentQuestion, index: number) => {
    const _assessmentQuestionsData = [...assessmentQuestionsData];
    _assessmentQuestionsData[index] = event;
    setAssessmentQuestionsData(_assessmentQuestionsData);
  };

  const handleQuestionDelete = (index: number) => {
    const _assessmentQuestionsData = [...assessmentQuestionsData];
    _assessmentQuestionsData.splice(index, 1);
    setAssessmentQuestionsData(_assessmentQuestionsData);
  };

  const handleSaveAssessment = () => {
    saveAssessmentById(assessmentData?.id || "", assessmentData, authorization).then(
      (response) => {
        fetchAssessmentById();
        fetchAssessmentQuestions();
      }
    );
  };

  const handleSaveAssessmentQuestions = () => {
    saveAssessmentQuestions(
      assessmentData?.id || "",
      assessmentQuestionsData
    ).then((response) => {
      fetchAssessmentQuestions();
    });
  };

  const handleDeleteAssessment = () => {
    deleteAssessmentById(assessmentData?.id || "").then((response) => {
      router.back();
    });
  };

  const [tab, setTab] = useState("1");

  const handleTabChange = (_tab: string) => {
    setTab(_tab);
  };

  useEffect(() => {
    if (searchParams.has("id")) {
      fetchAssessmentById();
      fetchAssessmentQuestions();
    }
  }, [authorization, searchParams]);

  const fetchAssessmentById = () => {
    if (authorization.isAuth) {
      getAssessmentById(authorization, searchParams.get("id") || "").then(
        (response) => {
          setAssessmentData(response);
        }
      );
    }
  };

  const fetchAssessmentQuestions = () => {
    if (authorization.isAuth) {
      getAssessmentQuestions(authorization, searchParams.get("id") || "").then(
        (response) => {
          setAssessmentQuestionsData(response);
        }
      );
    }
  };

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <div>
      <ContextBar title={assessmentData.name}>
        <Button onClick={handleSaveAssessment} theme={ThemeType.primary}>
          Save
        </Button>
        <Button onClick={() => router.back()}>Cancel</Button>
      </ContextBar>
      <div className="page">
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
      </div>
    </div>
  );
};

// export default withAuthValidation(AssessmentPage);
export default AssessmentPage;
