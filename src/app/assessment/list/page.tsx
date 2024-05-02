"use client";

import ContextBar from "@/components/ContextBar";
import {
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ThemeType,
} from "basicui";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faEye,
  faClose,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import { getAssessments, saveAssessment } from "./service";
import { Assessment } from "@/types/Assessment";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import ListItem from "./ListItem";

const AssessmentsPage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});

  const router = useRouter();
  const [data, setData] = useState<Assessment[]>();
  const [isNewAssessmentDialogOpen, setIsNewAssessmentDialogOpen] =
    useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState<Assessment>({
    name: "",
  });

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    setNewAssignmentForm({ name: "" });
  }, [isNewAssessmentDialogOpen]);

  const handleChange = (event: any) => {
    setNewAssignmentForm({
      ...newAssignmentForm,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSaveNewAssignment = () => {
    saveAssessment(newAssignmentForm, authorization).then((response: any) => {
      setIsNewAssessmentDialogOpen(false);
      fetchAssessments();
    });
  };

  const handleEditAssessmentDetail = (id: string) => {
    router.push(`/assessment/edit?id=${id}`);
  };

  const handleKeydown = (event: any, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      handleEditAssessmentDetail(id);
    }
  };

  useEffect(() => {
    if (authorization.isAuth) {
      fetchAssessments();
    }
  }, [authorization]);

  const fetchAssessments = () => {
    getAssessments(authorization).then((response: any) => {
      setData(response);
    });
  };

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <>
      <div>
        <ContextBar title="Assessments list">
          <Button onClick={() => setIsNewAssessmentDialogOpen(true)}>
            <FontAwesomeIcon icon={faPlus} /> Assessment
          </Button>
        </ContextBar>
        <div className="page">
          <div className="large-search-bar">
            <Input placeholder="Type to search" />
          </div>
          <div className="card-list">
            {data?.map((item, index) => (
              <ListItem key={index} data={item} />
            ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isNewAssessmentDialogOpen}
        onClose={() => setIsNewAssessmentDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsNewAssessmentDialogOpen(false)}
          heading="New assessment"
        />

        <ModalBody>
          <div className="new-assessment-dialog">
            <Input
              name="name"
              value={newAssignmentForm.name}
              label="Assessment name"
              onInput={handleChange}
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button theme={ThemeType.primary} onClick={handleSaveNewAssignment}>
            <FontAwesomeIcon icon={faCheck} />
            Save
          </Button>
          <IconButton onClick={() => setIsNewAssessmentDialogOpen(false)}>
            <FontAwesomeIcon icon={faClose} />
          </IconButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

// export default withAuthValidation(AssessmentsPage);
export default AssessmentsPage;
