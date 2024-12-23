"use client";

import ContextBar from "@/components/ContextBar";
import {
  Button,
  ButtonVariantType,
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
  faClose,
  faPlus,
  faCheck,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Authorization } from "@/types/Authorization";
import { AuthorizationState } from "@/store/AuthorizationStore";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import "./style.css";

const HomePage = () => {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});

  const router = useRouter();

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  const handleEditAssessmentDetail = (id: string) => {
    router.push(`/assessment/edit?id=${id}`);
  };

  useEffect(() => {
    if (authorization.isAuth) {
    }
  }, [authorization]);

  // if (!isRouteAuthorized) {
  //   return <></>;
  // }

  return (
    <>
      <div>
        {/* <ContextBar title="Home"></ContextBar> */}
        <div className="page">
          <div className="module_list">
            <div className="home-tile">
              <div>
                <div className="button-heading">Resume Screener</div>
                <div className="button-description">
                  <p>
                    Generates STAR (Situation, Task, Action, Result) questions
                    using Open AI
                  </p>
                  <p>
                    Provides technical and business domain questions for
                    interviewer guidance
                  </p>
                  <p>
                    Summarizes key project details, technical skills, and domain
                    expertise
                  </p>
                  <p>
                    Conducts comparative analysis of candidate experience
                    against industry standards
                  </p>
                </div>
              </div>
              <Button
                // theme={ThemeType.primary}
                variant={ButtonVariantType.outline}
                onClick={() => router.push("/resume/list")}
              >
                <FontAwesomeIcon icon={faArrowRight} />
                Start
              </Button>
            </div>
            <div className="home-tile">
              <div>
                <div className="button-heading">Candidate Assessment</div>
                <div className="button-description">
                  <p>
                    Tailored Interview Questions aligned with specific job
                    descriptions.
                  </p>
                  <p>
                    Dual Assessment Modes (Multiple-choice and descriptive
                    questions).
                  </p>
                  <p>
                    Automated Analysis using OpenAI technology ensures accuracy
                    in responses.
                  </p>
                  <p>Job-Specific Profiles</p>
                </div>
              </div>
              <Button
                // theme={ThemeType.primary}
                variant={ButtonVariantType.outline}
                onClick={() => router.push("/assessment/list")}
              >
                <FontAwesomeIcon icon={faArrowRight} />
                Start
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
