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
    saveResume(newFileAttachment, authorization).then((response: any) => {
      setIsNewResumeDialogOpen(false);
      // fetchResumes();
      router.push(`/resume/view?id=${response.id}`);
    });
  };

  useEffect(() => {
    if (searchText && searchText !== "") {
      setView(
        data?.filter(
          (item) =>
            item.data?.name.toLowerCase().includes(searchText) ||
            item.data?.overview?.toLowerCase().includes(searchText)
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
          <div className="large-search-bar">
            <Input
              placeholder="Type to search"
              value={searchText}
              name="searchText"
              onInput={handleSearchTextChange}
            />
          </div>
          <div className="flat-list">
            {view?.map((item, index) => (
              <ListItem key={index} data={item} />
            ))}
          </div>
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
