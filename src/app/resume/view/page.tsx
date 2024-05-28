"use client";

import ContextBar from "@/components/ContextBar";
import {
  PermissionType,
  useRouteAuthorization,
} from "@/lib/RouteAuthorizationHook";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { Authorization } from "@/types/Authorization";
import { Resume } from "@/types/Resume";
import {
  faBank,
  faCalendar,
  faClose,
  faIndustry,
  faMessage,
  faPlus,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "basicui";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { getResumeById } from "./service";
import "./style.css";
import DataObjectViewer from "./DataObjectViewer";

export default function ViewResume() {
  const { hasPermissions, isRouteAuthorized } = useRouteAuthorization("1");
  useLayoutEffect(() => {
    hasPermissions([PermissionType.USER]);
  }, []);
  const [authorization, setAuthorization] = useState<Authorization>({});
  const [resumeData, setResumeData] = useState<Resume>({
    name: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  useEffect(() => {
    if (searchParams.has("id")) {
      fetchResumeById();
    }
  }, [authorization, searchParams]);

  const fetchResumeById = () => {
    if (authorization.isAuth) {
      getResumeById(authorization, searchParams.get("id") || "").then(
        (response) => {
          setResumeData(response);
        }
      );
    }
  };

  if (!isRouteAuthorized) {
    return <></>;
  }
  return (
    <div>
      <ContextBar>
        <Button onClick={() => {}}>
          <FontAwesomeIcon icon={faClose} />
          Close
        </Button>
      </ContextBar>
      <div className="page">
        <div className="view-resume">
          <div className="view-resume__element view-resume__heading">
            <h1 className="view-resume__heading__name">{resumeData.name}</h1>
            <div className="view-resume__heading__designation">
              {resumeData.standardizedDesignation} |{" "}
              {resumeData.totalExperience}
            </div>
            <div className="view-resume__heading__overview">
              {resumeData.overview || "-"}
            </div>
          </div>

          <div className="view-resume__element__group view-resume__questions__group">
            <div className="view-resume__element">
              <div className="view-resume__element__label">
                <div className="view-resume__element__label__icon">
                  <FontAwesomeIcon icon={faMessage} />
                </div>
                Questions to be asked
              </div>
              <div className="view-resume__questions view-resume__element__value">
                <div className="data-subheading">Technical</div>
                {resumeData.questionsToBeAsked &&
                  resumeData.questionsToBeAsked?.technical &&
                  resumeData.questionsToBeAsked.technical.map(
                    (item: string) => (
                      <div className="view-resume__questions__item">{item}</div>
                    )
                  )}
                <div className="data-subheading">Overall</div>
                {resumeData.questionsToBeAsked &&
                  resumeData.questionsToBeAsked?.overall &&
                  resumeData.questionsToBeAsked.overall.map((item: string) => (
                    <div className="view-resume__questions__item">{item}</div>
                  ))}
              </div>
            </div>
          </div>

          <div className="view-resume__element__group">
            <div className="view-resume__element">
              <div className="view-resume__element__label">
                <div className="view-resume__element__label__icon">
                  <FontAwesomeIcon icon={faTools} />
                </div>
                Key project
              </div>
              <div className="view-resume__element__value">
                {resumeData.keyProject || "-"}
              </div>
            </div>
          </div>

          <div className="view-resume__element__group">
            <div className="view-resume__element">
              <div className="view-resume__element__label">
                <div className="view-resume__element__label__icon">
                  <FontAwesomeIcon icon={faTools} />
                </div>
                Technical Skills
              </div>
              <div className="view-resume__element__value">
                <DataObjectViewer data={resumeData.technicalSkills} />
              </div>
            </div>
            <div className="view-resume__element">
              <div className="view-resume__element__label">
                <div className="view-resume__element__label__icon">
                  <FontAwesomeIcon icon={faBank} />
                </div>
                Domain Skills
              </div>
              <div className="view-resume__element__value">
                <DataObjectViewer data={resumeData.domainSkills} />
              </div>
            </div>
          </div>

          <div className="view-resume__element__group">
            <div className="view-resume__element">
              <div className="view-resume__element__label">
                <div className="view-resume__element__label__icon">
                  <FontAwesomeIcon icon={faCalendar} />
                </div>
                Experiece
              </div>
              <div className="view-resume__element__value">
                <div className="view-resume__element__value__entry">
                  Total experience: {resumeData.totalExperience || "-"}
                </div>
                <div className="view-resume__element__value__entry">
                  Industry Normalized total experience:{" "}
                  {resumeData.industryNormalizedExperience || "-"}
                </div>
                <div className="view-resume__element__value__entry">
                  Experience with recent organization:{" "}
                  {resumeData.recentExperience || "-"}
                </div>
                <div className="view-resume__element__value__entry">
                  Average experience in an organization:{" "}
                  {resumeData.avgExperiencePerCompany || "-"}
                </div>
                <div className="view-resume__element__value__entry">
                  Longest experience with any organization:{" "}
                  {resumeData.longestExperience || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
