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
  deleteAssessmentById,
  deleteAssessmentQuestionById,
  generateNewAssessmentQuestion,
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
  faPen,
  faPlus,
  faWandMagic,
  faWandMagicSparkles,
  faWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import EditAssessmentDialog from "./EditAssessmentDialog";

const sampleData = require("./data.json");

const BLANK_ASSESSMENT_QUESTION: AssessmentQuestion = {
  question: "",
  answer: " ",
  assessmentId: "",
  type: "multiple-choice",
  choices: ["", "", "", ""],
};

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
    saveAssessmentQuestionById(
      assessmentData?.id || "",
      event,
      authorization
    ).then((response) => {
      fetchAssessmentQuestions();
    });
  };

  const handleQuestionDelete = (event: AssessmentQuestion) => {
    deleteAssessmentQuestionById(
      assessmentData?.id || "",
      event,
      authorization
    ).then((response) => {
      fetchAssessmentQuestions();
    });
  };


  const handleSaveAssessment = (data: Assessment) => {
    saveAssessmentById(assessmentData?.id || "", data, authorization).then(
      (response) => {
        fetchAssessmentById();
        fetchAssessmentQuestions();
        setIsEditAssessmentDialogOpen(false);
      }
    );
  };
  
  const handleDeleteAssessment = () => {
    deleteAssessmentById(assessmentData?.id || "").then((response) => {
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
        assessmentId: assessmentData.id || "",
      },
    });
  };

  const handleAddNewQuestion = () => {
    setAddNewDialogState({
      isOpen: true,
      assessmentQuestion: {
        ...BLANK_ASSESSMENT_QUESTION,
        assessmentId: assessmentData.id || "",
      },
    });
  };

  const handleGenerateNewQuestion = () => {
    generateNewAssessmentQuestion(assessmentData.id || "", authorization).then(
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
    const choices = [...addNewDialogState.assessmentQuestion.choices];
    choices[index] = event.currentTarget.value;
    setAddNewDialogState({
      ...addNewDialogState,
      assessmentQuestion: { ...addNewDialogState.assessmentQuestion, choices },
    });
  };

  const handleChoiceChange = (answer: string, index: number) => {
    setAddNewDialogState({
      ...addNewDialogState,
      assessmentQuestion: { ...addNewDialogState.assessmentQuestion, answer },
    });
  };

  const handleQuestionChange = (event: any) => {
    setAddNewDialogState({
      ...addNewDialogState,
      assessmentQuestion: {
        ...addNewDialogState.assessmentQuestion,
        question: event.target.value,
      },
    });
  };

  const handleSaveNewQuestion = () => {
    if (addNewDialogState.assessmentQuestion.id) {
      saveAssessmentQuestionById(
        addNewDialogState.assessmentQuestion.id,
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

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <>
      <div>
        <ContextBar title={assessmentData.name}>
          <Button onClick={handleAddNewQuestion}>
            <FontAwesomeIcon icon={faPlus} />
            Question
          </Button>
          <Button onClick={() => setIsEditAssessmentDialogOpen(true)}>
            <FontAwesomeIcon icon={faPen} />
            Job description
          </Button>
          {/* <Button onClick={() => router.back()}>Back</Button> */}
        </ContextBar>
        <div className="page">
          <div className="assessment-questions">
            {assessmentQuestionsData.map((item, index: number) => (
              <ObjectiveQuestion
                onChange={(event: AssessmentQuestion) =>
                  handleQuestionSave(event, index)
                }
                onDelete={() => handleQuestionDelete(item)}
                key={index}
                question={item}
                index={index}
              />
            ))}
          </div>
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
                    value={addNewDialogState.assessmentQuestion?.question}
                    rows="10"
                    onInput={handleQuestionChange}
                    placeholder="Question"
                  />
                  <div className="objective-question__choices">
                    {addNewDialogState.assessmentQuestion?.choices.map(
                      (item, index: number) => (
                        <div
                          className="objective-question__choices__choice"
                          key={index}
                        >
                          <Radio
                            checked={
                              item ===
                              addNewDialogState.assessmentQuestion.answer
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
