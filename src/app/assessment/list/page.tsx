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
import { getAssessments, saveAssessment } from "./service";
import { Assessment } from "@/types/Assessment";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
// https://docs.fontawesome.com/web/use-with/react/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

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
    saveAssessment(newAssignmentForm).then((response: any) => {
      setIsNewAssessmentDialogOpen(false);
      fetchAssessments();
    });
  };

  const handleEditAssessmentDetail = (id: string) => {
    router.push(`/assessment/edit/details?id=${id}`);
  };

  const handleManageAssessmentQuestions = (id: string) => {
    router.push(`/assessment/edit/questions?id=${id}`);
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
            New assessment
          </Button>
        </ContextBar>
        <div className="page">
          <IconButton className="icon_button" circle={true}>
            <FontAwesomeIcon icon={faPen} />
          </IconButton>
          <br /><br />
          <table className="basicui-table theme-default">
            <thead>
              <tr>
                <th>Assessment name</th>
                <th>Created on</th>
                <th>Status</th>
                <th>Responses</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={index}
                  tabIndex={0}
                  // onClick={() => handleEditAssessmentDetail(item.id || "")}
                  // onKeyDown={(event) => handleKeydown(event, item.id || "")}
                >
                  <td>{item.name}</td>
                  <td>{item.createdDate}</td>
                  <td>{item.status}</td>
                  <td>{5}</td>
                  <td>
                    <IconButton
                      circle
                      onClick={() => handleEditAssessmentDetail(item.id || "")}
                    >
                      E
                    </IconButton>
                    <IconButton
                      circle
                      onClick={() =>
                        handleManageAssessmentQuestions(item.id || "")
                      }
                    >
                      Q
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isNewAssessmentDialogOpen}
        onClose={() => setIsNewAssessmentDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsNewAssessmentDialogOpen(false)}
          heading="Create new assessment"
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
            Save
          </Button>
          <Button onClick={() => setIsNewAssessmentDialogOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

// export default withAuthValidation(AssessmentsPage);
export default AssessmentsPage;
