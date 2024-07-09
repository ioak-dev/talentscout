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
import EditAssessmentDialog from "../edit/EditAssessmentDialog";
import { saveAssessmentById } from "../edit/service";

const AssessmentsPage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});

  const router = useRouter();
  const [data, setData] = useState<Assessment[]>();
  const [view, setView] = useState<Assessment[]>();
  const [searchText, setSearchText] = useState("");
  const [isNewAssessmentDialogOpen, setIsNewAssessmentDialogOpen] =
    useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState<Assessment>({
    name: "",
  });
  const [isEditAssessmentDialogOpen, setIsEditAssessmentDialogOpen] =
    useState(false);
  const [assessmentId,setAssessmentId]=useState(null);
  const [assessmentData, setAssessmentData] = useState<Assessment>({
    name: "",
    skillSet: "",
  });

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    setNewAssignmentForm({ name: "" });
  }, [isNewAssessmentDialogOpen]);

  useEffect(() => {
    if (searchText && searchText !== "") {
      setView(
        data?.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText) ||
            item.jobDescription?.toLowerCase().includes(searchText)
        )
      );
    } else {
      setView(data);
    }
  }, [searchText, data]);

  const handleSearchTextChange = (event: any) => {
    setSearchText(event.currentTarget.value?.toLowerCase());
  };

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

  const handleEditAssessment = (id:any,data:Assessment) =>{
    setAssessmentData(data);
    setIsEditAssessmentDialogOpen(true);
  }

  const handleSaveAssessment = (data: Assessment) => {
    setIsEditAssessmentDialogOpen(false);
    saveAssessmentById(assessmentData?._id || "", data, authorization).then(
      (response) => {
        console.log(response)
        fetchAssessments();
      }
    );
  };

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <>
      <div>
        <ContextBar>
          <Button onClick={() => setIsNewAssessmentDialogOpen(true)}>
            <FontAwesomeIcon icon={faPlus} /> Assessment
          </Button>
        </ContextBar>
        <div className="page">
          {data?.length !== 0 && (
            <div className="large-search-bar">
              <Input
                placeholder="Type to search"
                value={searchText}
                name="searchText"
                onInput={handleSearchTextChange}
              />
            </div>
          )}
          <div className="card-list">
            {view?.map((item, index) => (
              <ListItem key={index} 
                data={item}
                handleEditAssessment={handleEditAssessment}
                authorization={authorization}
                fetchAssessments={fetchAssessments}/>
            ))}
          </div>
          {data?.length == 0 && (
            <div className="no-data-container">
              <h2>No assessments present</h2>
              {/* <p>Please add the assessment</p> */}
            </div>
          )}
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
      <EditAssessmentDialog
        isOpen={isEditAssessmentDialogOpen}
        onClose={() => setIsEditAssessmentDialogOpen(false)}
        data={assessmentData}
        onSave={handleSaveAssessment}
      />
    </>
  );
};

// export default withAuthValidation(AssessmentsPage);
export default AssessmentsPage;
