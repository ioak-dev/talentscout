"use client";

import ContextBar from "@/components/ContextBar";
import { faCheck, faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import ListItem from "./ListItem";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import { Authorization } from "@/types/Authorization";
import { Resume } from "@/types/Resume";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { getResumes, saveResume } from "./service";
import { useRouter } from "next/navigation";

export default function Resumes() {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});

  const router = useRouter();
  const [data, setData] = useState<Resume[]>();
  const [view, setView] = useState<Resume[]>();
  const [searchText, setSearchText] = useState("");
  const [isNewResumeDialogOpen, setIsNewResumeDialogOpen] = useState(false);
  const [newFileAttachment, setNewFileAttachment] = useState<any>();
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    setNewFileAttachment(null);
  }, [isNewResumeDialogOpen]);

  const handleChange = (event: any) => {
    console.log(event.target.files[0]);
    setNewFileAttachment(event.target.files[0]);
  };

  const handleSaveNewAssignment = () => {
    setIsNewResumeDialogOpen(false);
    setIsLoad(true);
    saveResume(newFileAttachment, authorization).then((response: any) => {
      // fetchResumes();
      setIsLoad(false);
      router.push(`/resume/view?id=${response._id}`);
    });
  };

  useEffect(() => {
    if (searchText && searchText !== "") {
      setView(
        data?.filter((item) =>
          item?.fileName?.toLowerCase().includes(searchText)
        )
      );
    } else {
      setView(data);
    }
  }, [searchText, data]);

  const handleSearchTextChange = (event: any) => {
    setSearchText(event.currentTarget.value?.toLowerCase());
  };

  useEffect(() => {
    if (authorization.isAuth) {
      fetchResumes();
    }
  }, [authorization]);

  const fetchResumes = () => {
    getResumes(authorization).then((response: any) => {
      setData(response);
    });
  };

  if (!isRouteAuthorized) {
    return <></>;
  }

  return (
    <>
      <div>
        <ContextBar>
          <Button onClick={() => setIsNewResumeDialogOpen(true)}>
            <FontAwesomeIcon icon={faPlus} /> Resume
          </Button>
        </ContextBar>
        <div className="page">
          {isLoad && (
            <div className="loader-container">
              <div className="loader"></div>
              <div>
                <p>Screening the resume, Please wait...</p>
              </div>
            </div>
          )}
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
          <div className="flat-list">
            {view?.map((item, index) => (
              <ListItem key={index} data={item} />
            ))}
          </div>
          {data?.length == 0 && (
            <div className="no-data-container">
              <h2>No resumes present</h2>
              {/* <p>Please add the assessment</p> */}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isNewResumeDialogOpen}
        onClose={() => setIsNewResumeDialogOpen(false)}
      >
        <ModalHeader
          onClose={() => setIsNewResumeDialogOpen(false)}
          heading="New resume"
        />

        <ModalBody>
          <div className="new-resume-dialog">
            <Input
              name="name"
              type="file"
              label="Candidate resume"
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
          <IconButton onClick={() => setIsNewResumeDialogOpen(false)}>
            <FontAwesomeIcon icon={faClose} />
          </IconButton>
        </ModalFooter>
      </Modal>
    </>
  );
}
