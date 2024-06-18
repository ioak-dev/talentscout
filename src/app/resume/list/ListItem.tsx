"use client";

import { ButtonVariantType, IconButton, Input, Link, ThemeType } from "basicui";
import { redirect, useRouter } from "next/navigation";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faChartSimple,
  faDotCircle,
  faEye,
  faFile,
  faFolderOpen,
  faList,
  faListDots,
  faPen,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { Resume } from "@/types/Resume";

interface Props {
  data: Resume;
}

const ListItem = (props: Props) => {
  const router = useRouter();

  const handleViewResumeDetail = (id: string) => {
    router.push(`/resume/view?id=${id}`);
  };

  return (
    <div className="flat-list-item resume-list-item">
      <div className="flat-list-item-main">
        <div>
          <div className="resume-list-item__name">
            {props.data?.fileName}
          </div>
        </div>
      </div>
      <div className="flat-list-item-actions">
        <IconButton
          circle
          onClick={() => handleViewResumeDetail(props.data.id || "")}
          variant={ButtonVariantType.outline}
        >
          <FontAwesomeIcon icon={faFolderOpen} />
        </IconButton>
      </div>
    </div>
  );
};

// export default withAuthValidation(ResumesPage);
export default ListItem;
