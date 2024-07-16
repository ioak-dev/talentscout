"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getResponseDetail, getUserDetails } from "./service";
import { Button, Radio } from "basicui";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContextBar from "@/components/ContextBar";
import {
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faSquareCheck,
  faSquareXmark,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

const responseDetail = () => {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");
  const responseId = searchParams.get("responseId");
  const router = useRouter();
  const [responseDetail, setResponseDetail] = useState<any>([]);
  const [userDetail, setUserDetail] = useState<any>({});
  useEffect(() => {
    viewResponse();
    getUserResponse();
  }, []);

  const viewResponse = () => {
    getResponseDetail(assessmentId, responseId).then((res: any) => {
      setResponseDetail(res);
    });
  };

  const getUserResponse = () => {
    getUserDetails(assessmentId, responseId).then((res: any) => {
      setUserDetail(res);
      console.log(res);
    });
  };

  const closeResponseDetail = () => {
    router.back();
  };

  return (
    <div>
      <ContextBar
        title={
          userDetail.givenName +
          " " +
          userDetail.familyName +
          " " +
          "( " +
          userDetail.score +
          "/" +
          userDetail.totalQuestions +
          " )"
        }
      >
        <Button onClick={() => closeResponseDetail()}>
          <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
          Close
        </Button>
      </ContextBar>
      <div className="page">
        <div className="response_container">
          {responseDetail.length > 0 ? (
            responseDetail.map((item: any, index: number) => (
              <div
                key={index}
                className={`response ${item.question.data.answer === item.answer ? "correct" : "incorrect"}`}
              >
                <div className="response_header">
                  {/* {item.answer === item.question.data.answer && (
            <div className="response_icon check">
              <FontAwesomeIcon icon={faSquareCheck}></FontAwesomeIcon>
            </div>
          )}
          {item.answer !== item.question.data.answer && (
            <div className="response_icon cross">
              <FontAwesomeIcon icon={faSquareXmark}></FontAwesomeIcon>
            </div>
          )} */}
                </div>
                <div className="response_question">
                  <pre>
                    {index + 1}.{item.question.data.question}{" "}
                  </pre>
                </div>
                <div className={`response_correct_answer`}>
                  <h6>Expected answer</h6> : {item.question.data.answer}
                </div>
                <div className={`response_user_answer`}>
                  <h6>Selected answer</h6> : {item.answer || "-"}
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default responseDetail;
