"use client";

import { ButtonVariantType, IconButton, Input, Link, ThemeType } from "basicui";
import { redirect, useRouter } from "next/navigation";
import { Assessment } from "@/types/Assessment";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faList,
  faPen,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  data: Assessment;
}

const ListItem = (props: Props) => {
  const router = useRouter();
  let formattedDate = "";
  if (props.data.createdDate) {
  formattedDate = new Date(props.data.createdDate).toLocaleDateString("en-GB");
  }

  const handleEditAssessmentDetail = (id: string) => {
    router.push(`/assessment/edit?id=${id}`);
  };

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

          <div className="assessment-list-item__created">
            {formattedDate}
          </div>
        </div>
        <div className="list-item-subtitle">Skill set</div>
        <div className="assessment-list-item__skillsets">
        {props.data.skillSet ? props.data.skillSet?.join(', ') : '-'}
        </div>
        <div className="list-item-subtitle">Response</div>
        <div className="assessment-list-item__responses">0 responses</div>
      </div>
      <div className="list-item-actions">
        <IconButton
          circle
          onClick={() => handleEditAssessmentDetail(props.data._id || "")}
          variant={ButtonVariantType.outline}
        >
          <FontAwesomeIcon icon={faPen} />
        </IconButton>
        <IconButton
          circle
          onClick={() => handleEditAssessmentDetail(props.data._id || "")}
          variant={ButtonVariantType.outline}
        >
          <FontAwesomeIcon icon={faChartSimple} />
        </IconButton>
      </div>
    </div>
  );
};

// export default withAuthValidation(AssessmentsPage);
export default ListItem;
