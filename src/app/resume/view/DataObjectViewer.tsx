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
  data: any;
}

const DataObjectViewer = (props: Props) => {
  return (
    <div className="data-object-viewer">
      {props.data &&
        Object.keys(props.data)?.map((groupName: any) => (
          <div key={groupName}>
            <div className="data-subheading">{groupName}</div>
            {typeof props.data[groupName] === "object" &&
              props.data[groupName].map((item: string, index: number) => (
                <span key={item}>
                  {item}
                  {index !== props.data[groupName].length - 1 && <>, </>}{" "}
                </span>
              ))}
            {typeof props.data[groupName] !== "object" && (
              <>{props.data[groupName]}</>
            )}
          </div>
        ))}
    </div>
  );
};

// export default withAuthValidation(ResumesPage);
export default DataObjectViewer;
