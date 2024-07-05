"use client";

import ContextBar from "@/components/ContextBar";
import ObjectiveQuestion from "@/components/ObjectiveQuestion";
import {
  Button,
  ButtonVariantType,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
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
  changeAssessmentStatus,
  createNewQuestion,
  deleteAssessmentById,
  deleteAssessmentQuestionById,
  generateNewAssessmentQuestion,
  generateQuestionsUsingAi,
  getAssessmentById,
  getAssessmentQuestions,
  saveAssessmentById,
  saveAssessmentQuestionById,
  saveAssessmentQuestions,
} from "./service";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { AssessmentQuestion } from "@/types/AssessmentQuestion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClose,
  faKeyboard,
  faPause,
  faPen,
  faPlay,
  faPlus,
  faStop,
  faWandMagic,
  faWandMagicSparkles,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import EditAssessmentDialog from "./EditAssessmentDialog";

const sampleData = require("./data.json");

const BLANK_ASSESSMENT_QUESTION: AssessmentQuestion = {
  data: {
    question: "",
    answer: " ",
    choices: ["", "", "", ""],
  },
  assessmentId: "",
  type: "MultipleChoice",
};

const AssessmentPage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});
  const [assessmentData, setAssessmentData] = useState<Assessment>({
    name: "",
    skillSet: "",
  });
  const [assessmentQuestionsData, setAssessmentQuestionsData] = useState<
    AssessmentQuestion[]
  >([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditAssessmentDialogOpen, setIsEditAssessmentDialogOpen] =
    useState(false);
  const [addNewDialogState, setAddNewDialogState] = useState<{
    isOpen: boolean;
    type?: "manual" | "generated" | "edit-generated";
    assessmentQuestion: AssessmentQuestion;
  }>({
    isOpen: false,
    assessmentQuestion: BLANK_ASSESSMENT_QUESTION,
  });
  const [isLoad, setIsLoad] = useState(false);

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

  const handleQuestionSave = (event: AssessmentQuestion, index: number) => {
    console.log(event);
    saveAssessmentQuestionById(
      assessmentData?._id || "",
      event,
      authorization
    ).then((response) => {
      fetchAssessmentQuestions();
    });
  };

  const handleQuestionDelete = (event: AssessmentQuestion) => {
    deleteAssessmentQuestionById(
      assessmentData?._id || "",
      event,
      authorization
    ).then((response) => {
      fetchAssessmentQuestions();
    });
  };

  const handleSaveAssessment = (data: Assessment) => {
    setIsLoad(true);
    setIsEditAssessmentDialogOpen(false);
    saveAssessmentById(assessmentData?._id || "", data, authorization).then(
      (response) => {
        fetchAssessmentById();
        fetchAssessmentQuestions();
        setIsLoad(false);
      }
    );
  };

  const handleDeleteAssessment = () => {
    deleteAssessmentById(assessmentData?._id || "").then((response) => {
      router.back();
    });
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

  const handleAddNewDialogStateChange = (event: any) => {
    setAddNewDialogState({ ...addNewDialogState, ...event });
  };

  const closeAddNewQuestionDialog = () => {
    setAddNewDialogState({
      isOpen: false,
      assessmentQuestion: {
        ...BLANK_ASSESSMENT_QUESTION,
        assessmentId: assessmentData._id || "",
      },
    });
  };

  const handleAddNewQuestion = () => {
    setAddNewDialogState({
      isOpen: true,
      assessmentQuestion: {
        ...BLANK_ASSESSMENT_QUESTION,
        assessmentId: assessmentData._id || "",
      },
    });
  };

  const handleGenerateNewQuestion = () => {
    generateNewAssessmentQuestion(assessmentData._id || "", authorization).then(
      (response) => {
        setAddNewDialogState({
          ...addNewDialogState,
          assessmentQuestion: { ...response },
          type: "generated",
        });
        fetchAssessmentQuestions();
      }
    );
  };

  const handleChoiceTextChange = (event: any, index: number) => {
    const choices = [...addNewDialogState.assessmentQuestion.data.choices];
    choices[index] = event.currentTarget.value;
    setAddNewDialogState({
      ...addNewDialogState,
      assessmentQuestion: {
        ...addNewDialogState.assessmentQuestion,
        data: { ...addNewDialogState.assessmentQuestion.data, choices },
      },
    });
  };

  const handleChoiceChange = (answer: string, index: number) => {
    setAddNewDialogState({
      ...addNewDialogState,
      assessmentQuestion: {
        ...addNewDialogState.assessmentQuestion,
        data: { ...addNewDialogState.assessmentQuestion.data, answer },
      },
    });
  };

  const handleQuestionChange = (event: any) => {
    setAddNewDialogState({
      ...addNewDialogState,
      assessmentQuestion: {
        ...addNewDialogState.assessmentQuestion,
        data: {
          ...addNewDialogState.assessmentQuestion.data,
          question: event.target.value,
        },
      },
    });
  };

  const handleSaveNewQuestion = () => {
    if (addNewDialogState.assessmentQuestion._id) {
      saveAssessmentQuestionById(
        assessmentData._id || "",
        addNewDialogState.assessmentQuestion,
        authorization
      ).then((response) => {
        fetchAssessmentQuestions();
        setAddNewDialogState({
          isOpen: false,
          assessmentQuestion: BLANK_ASSESSMENT_QUESTION,
        });
      });
    } else {
      createNewQuestion(
        assessmentData._id || "",
        addNewDialogState.assessmentQuestion,
        authorization
      ).then((response) => {
        fetchAssessmentQuestions();
        setAddNewDialogState({
          isOpen: false,
          assessmentQuestion: BLANK_ASSESSMENT_QUESTION,
        });
      });
    }
  };

  const handleStatusChange = (
    status: "Draft" | "Active" | "Paused" | "Closed"
  ) => {
    changeAssessmentStatus(
      assessmentData._id || "",
      status,
      authorization
    ).then((response) => {
      fetchAssessmentById();
    });
  };

  const handleGenerateUsingAi = () => {
    const text =
      "Well Experienced with SAP ABAP CDS View (Core Data Services / HANA). Business Technology Platform (BTP). Should have knowledge of know-how of Cloud Foundry environment on BTP. Android SDK for Fiori. Experienced in moderating customer blueprint workshops, managing system requirements and designing according to user experience solution. Focus on SAP's latest user experience technologies. Independently execute system configuration, development and documentation tasks with SAP FIORI / HTML5 / OData Services and SAP CD. Consulting experience, working with user interface technology. Understanding of the SAP technology stack and basics. Framework development e.g., React, Angular GS. Experience with SAP UI5/ Open UI5. Good knowledge on Data dictionary and related concepts. Should be able to develop technical specifications independently.";
    generateQuestionsUsingAi(
      assessmentData._id || "",
      text,
      authorization
    ).then((response) => {
      console.log(response);
    });
  };

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <>
      <div>
        <ContextBar title={assessmentData.name}>
          {["Draft", "Paused"].includes(assessmentData.status || "") && (
            <Button onClick={handleAddNewQuestion}>
              <FontAwesomeIcon icon={faPlus} />
              Question
            </Button>
          )}
          {["Draft", "Paused"].includes(assessmentData.status || "") && (
            <Button onClick={handleGenerateUsingAi}>
              <FontAwesomeIcon icon={faWandMagic} />
              Generate using AI
            </Button>
          )}
          {["Draft", "Paused"].includes(assessmentData.status || "") && (
            <Button onClick={() => setIsEditAssessmentDialogOpen(true)}>
              <FontAwesomeIcon icon={faPen} />
              Job description
            </Button>
          )}
          {["Draft", "Paused"].includes(assessmentData.status || "") && (
            <Button
              onClick={() => handleStatusChange("Active")}
              theme={ThemeType.primary}
            >
              <FontAwesomeIcon icon={faPlay} />
              Launch
            </Button>
          )}
          {assessmentData.status === "Closed" && (
            <Button
              onClick={() => handleStatusChange("Paused")}
              theme={ThemeType.primary}
            >
              <FontAwesomeIcon icon={faPlay} />
              Reopen
            </Button>
          )}
          {assessmentData.status === "Active" && (
            <Button
              onClick={() => handleStatusChange("Paused")}
              theme={ThemeType.warning}
            >
              <FontAwesomeIcon icon={faPause} />
              Pause
            </Button>
          )}
          {assessmentData.status === "Active" && (
            <Button
              onClick={() => handleStatusChange("Closed")}
              theme={ThemeType.danger}
            >
              <FontAwesomeIcon icon={faStop} />
              Close
            </Button>
          )}
          {/* <Button onClick={() => router.back()}>Back</Button> */}
        </ContextBar>
        <div className="page">
          {!isLoad && (
            <div className="assessment-questions">
              {assessmentQuestionsData.map((item, index: number) => (
                <ObjectiveQuestion
                  onChange={(event: AssessmentQuestion) =>
                    handleQuestionSave({ ...item, ...event }, index)
                  }
                  onDelete={() => handleQuestionDelete(item)}
                  key={index}
                  question={item.data}
                  index={index}
                  status={assessmentData.status || ""}
                />
              ))}
            </div>
          )}
          {isLoad && (
            <div className="loader-container">
              <div className="loader"></div>
              <div>
                <p>Questions are being generated, Please wait...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={addNewDialogState?.isOpen}
        onClose={closeAddNewQuestionDialog}
      >
        <ModalHeader
          onClose={closeAddNewQuestionDialog}
          heading="New question"
        />
        <ModalBody>
          <div className="assessment-questions-newdialog">
            {!addNewDialogState.type && (
              <div className="assessment-questions-newdialog__type">
                <Button
                  onClick={() =>
                    handleAddNewDialogStateChange({ type: "manual" })
                  }
                  theme={ThemeType.primary}
                  variant={ButtonVariantType.transparent}
                >
                  <FontAwesomeIcon icon={faKeyboard} />
                  Type my own question
                </Button>
                <Button
                  onClick={handleGenerateNewQuestion}
                  theme={ThemeType.primary}
                  variant={ButtonVariantType.transparent}
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} />
                  Generate question using AI
                </Button>
              </div>
            )}
            {addNewDialogState.type === "generated" && (
              <div>
                <div>
                  New question has been generated and saved to your assessment
                  questions set.
                </div>
                <div className="assessment-questions-newdialog__type">
                  <Button
                    onClick={() =>
                      handleAddNewDialogStateChange({ type: "edit-generated" })
                    }
                    theme={ThemeType.primary}
                    variant={ButtonVariantType.transparent}
                  >
                    <FontAwesomeIcon icon={faPen} />
                    Edit generated question
                  </Button>
                  <Button
                    onClick={closeAddNewQuestionDialog}
                    theme={ThemeType.primary}
                    variant={ButtonVariantType.transparent}
                  >
                    <FontAwesomeIcon icon={faClose} />I will review later. Close
                  </Button>
                </div>
              </div>
            )}

            {addNewDialogState.type &&
              ["manual", "edit-generated"].includes(addNewDialogState.type) && (
                <div className="objective-question-edit">
                  <Textarea
                    name="question"
                    value={addNewDialogState.assessmentQuestion?.data?.question}
                    rows="10"
                    onInput={handleQuestionChange}
                    placeholder="Question"
                    autoFocus
                  />
                  <div className="objective-question__choices">
                    {addNewDialogState.assessmentQuestion?.data?.choices.map(
                      (item, index: number) => (
                        <div
                          className="objective-question__choices__choice"
                          key={index}
                        >
                          <Radio
                            checked={
                              item ===
                              addNewDialogState.assessmentQuestion.data?.answer
                            }
                            value={item}
                            onChange={() => handleChoiceChange(item, index)}
                          />
                          <Input
                            value={item}
                            name={`choice-${index + 1}`}
                            placeholder={`Choice #${index + 1}`}
                            onInput={(event: any) =>
                              handleChoiceTextChange(event, index)
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </ModalBody>
        {addNewDialogState.type &&
          ["manual", "edit-generated"].includes(addNewDialogState.type) && (
            <ModalFooter>
              {/* {addNewDialogState.type === "manual" && (
              <> */}
              <Button theme={ThemeType.primary} onClick={handleSaveNewQuestion}>
                <FontAwesomeIcon icon={faCheck} />
                Save
              </Button>
              <IconButton onClick={closeAddNewQuestionDialog}>
                <FontAwesomeIcon icon={faClose} />
              </IconButton>
              {/* </>
            )} */}
            </ModalFooter>
          )}
      </Modal>
      <EditAssessmentDialog
        isOpen={isEditAssessmentDialogOpen}
        onClose={() => setIsEditAssessmentDialogOpen(false)}
        data={assessmentData}
        onSave={handleSaveAssessment}
      />
    </>
  );
};

// export default withAuthValidation(AssessmentPage);
export default AssessmentPage;
