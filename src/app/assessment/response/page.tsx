"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getResponses } from "./responseService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonVariantType, IconButton } from "basicui";
import "./response.css";

const ResponsePage = () => {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");
  const router = useRouter();
  const [assessmentResponse, setAssessmentResponse] = useState([]);
  useEffect(() => {
    viewResponse();
  }, []);

  const viewResponse = () => {
    getResponses(assessmentId).then((res: any) => {
      console.log(res);
      setAssessmentResponse(res);
    });
  };

  const navigateToIndividualResponse = (id: any) => {
    router.push(
      `/assessment/responseDetail?assessmentId=${assessmentId}&responseId=${id}`
    );
  };

  const calculatePercentage = (score: any, totalQuestions: any) => {
    return (score / totalQuestions) * 100;
  };

  const sortByPercentage = () => {
    const sortedResponses = assessmentResponse
      .slice()
      .sort((a: any, b: any) => {
        const percentageA = calculatePercentage(a.score, a.totalQuestions);
        const percentageB = calculatePercentage(b.score, b.totalQuestions);
        return percentageB - percentageA;
      });
    setAssessmentResponse(sortedResponses);
  };

  return (
    <div className="page">
      <table
        className={`basicui-table theme-default table-hover response-table`}
      >
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>E-mail</th>
            <th>Test taken on</th>
            <th>Score</th>
            <th>
              Percentage &nbsp;
              <FontAwesomeIcon onClick={sortByPercentage} icon={faSort} />
            </th>
          </tr>
        </thead>
        <tbody>
          {assessmentResponse.map((item: any, index: number) => {
            const percentage = (item.score / item.totalQuestions) * 100;
            return (
              <tr
                key={index}
                tabIndex={0}
                onClick={() => navigateToIndividualResponse(item._id)}
              >
                <td>
                  {!item.isSubmitted && <FontAwesomeIcon icon={faSpinner} />}
                </td>
                <td>
                  {item.givenName} {item.familyName}
                </td>
                <td>{item.email}</td>
                <td>{new Date(item.updatedAt).toLocaleDateString("en-GB")}</td>
                <td>
                  {item.score}/{item.answered}
                </td>
                <td>{percentage.toFixed(2)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsePage;
