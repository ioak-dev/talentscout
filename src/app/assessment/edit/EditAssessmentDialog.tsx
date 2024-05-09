"use client";

import ContextBar from "@/components/ContextBar";
import ObjectiveQuestion from "@/components/ObjectiveQuestion";
import {
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";

const sampleData = require("./data.json");

interface Props {
  isOpen: boolean;
  onClose: any;
  data: Assessment;
  onSave: any;
}

const EditAssessmentDialog = (props: Props) => {
  const [authorization, setAuthorization] = useState<Authorization>({});

  const [assessmentData, setAssessmentData] = useState<Assessment>({
    name: "",
  });

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    if (props.data) {
      setAssessmentData({...props.data});
    }
  }, [props.data]);

  const handleAssessmentDataChange = (event: any) => {
    setAssessmentData({
      ...assessmentData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSave = () => {
    props.onSave(assessmentData);
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalHeader onClose={props.onClose} heading="Edit Assessment" />
      <ModalBody>
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
            autoFocus
            value={assessmentData?.jobDescription}
            onInput={handleAssessmentDataChange}
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button theme={ThemeType.primary} onClick={handleSave}>
          <FontAwesomeIcon icon={faCheck} />
          Save
        </Button>
        <IconButton onClick={props.onClose}>
          <FontAwesomeIcon icon={faClose} />
        </IconButton>
      </ModalFooter>
    </Modal>
  );
};

export default EditAssessmentDialog;
