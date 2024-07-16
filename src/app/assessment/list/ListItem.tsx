"use client";

import {
  ButtonVariantType,
  IconButton,
  Input,
  Link,
  ThemeType,
  Button,
} from "basicui";
import { redirect, useRouter } from "next/navigation";
import { Assessment } from "@/types/Assessment";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faList,
  faPen,
  faQuestion,
  faEye,
  faPlay,
  faPause,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { changeAssessmentStatus } from "../edit/service";

interface Props {
  data: Assessment;
  handleEditAssessment: any;
  authorization: any;
  fetchAssessments: any;
}

const ListItem = (props: Props) => {
  const router = useRouter();
  let formattedDate = "";
  if (props.data.createdDate) {
    formattedDate = new Date(props.data.createdDate).toLocaleDateString(
      "en-GB"
    );
  }

  const handleEditAssessmentDetail = (id: string) => {
    router.push(`/assessment/edit?id=${id}`);
  };

  const handleStatusChange = (
    status: "Draft" | "Active" | "Paused" | "Closed"
  ) => {
    changeAssessmentStatus(
      props.data._id || "",
      status,
      props.authorization
    ).then((response) => {
      props.fetchAssessments();
    });
  };

  const viewResponses = (id:any) =>{
    router.push(`/assessment/response?assessmentId=${id}`);
  }

  return (
    <div className="list-item assessment-list-item">
      <div className="list-item-main">
        <div className="status-chip">{props.data.status}</div>
        <div>
          <div className="assessment-list-item__name">
            {/* <Link href={`/assessment/edit/questions?id=${props.data._id}`}> */}
            {props.data.name}
            {/* </Link> */}
          </div>

          <div className="assessment-list-item__created">{formattedDate}</div>
        </div>
        <div className="list-item-subtitle">Skill set</div>
        <div className="assessment-list-item__skillsets">
          {props.data.skillSet ? props.data.skillSet?.join(", ") : "-"}
        </div>
        <div className="list-item-subtitle">Response</div>
        <div className="assessment-list-item__responses">0 responses</div>
      </div>
      <div className="list-item-actions">
        <div/>
        {/* <div className="list-item-status-buttons">
          {["Draft", "Paused"].includes(props.data.status || "") && (
            <IconButton
              onClick={() => handleStatusChange("Active")}
              circle
              variant={ButtonVariantType.outline}
            >
              <FontAwesomeIcon icon={faPlay} />
            </IconButton>
          )}
          {props.data.status === "Closed" && (
            <IconButton
              onClick={() => handleStatusChange("Paused")}
              circle
              variant={ButtonVariantType.outline}
            >
              <FontAwesomeIcon icon={faPlay} />
            </IconButton>
          )}
          {props.data.status === "Active" && (
            <IconButton
              onClick={() => handleStatusChange("Paused")}
              circle
              variant={ButtonVariantType.outline}
            >
              <FontAwesomeIcon icon={faPause} />
            </IconButton>
          )}
          {props.data.status === "Active" && (
            <IconButton
              onClick={() => handleStatusChange("Closed")}
              circle
              variant={ButtonVariantType.outline}
            >
              <FontAwesomeIcon icon={faStop} />
            </IconButton>
          )}
        </div> */}
        <div className="list-item-icon-buttons">
          <IconButton
            circle
            onClick={() => handleEditAssessmentDetail(props.data._id || "")}
            variant={ButtonVariantType.outline}
          >
            <FontAwesomeIcon icon={faQuestion} />
          </IconButton>
          <IconButton
            circle
            onClick={() =>
              props.handleEditAssessment(props.data._id || "", props.data)
            }
            variant={ButtonVariantType.outline}
          >
            <FontAwesomeIcon icon={faPen} />
          </IconButton>
          <IconButton
            circle
            onClick={() => viewResponses(props.data._id || "")}
            variant={ButtonVariantType.outline}
          >
            <FontAwesomeIcon icon={faChartSimple} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

// export default withAuthValidation(AssessmentsPage);
export default ListItem;
