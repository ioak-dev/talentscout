import { httpDelete, httpGet, httpPost, httpPut } from "@/lib/RestTemplate";
import { Assessment } from "@/types/Assessment";
import { AssessmentQuestion } from "@/types/AssessmentQuestion";

export const getAssessmentById = (authorization: any, id: string) => {
  console.log(authorization, id);
  return httpGet(`/assessment/${id}`, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve({});
    })
    .catch((error) => {
      return Promise.resolve({});
    });
};

export const saveAssessmentById = (
  id: string,
  payload: Assessment,
  authorization?: any
) => {
  return httpPut(`/assessment/${id}`, payload, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve({});
    })
    .catch((error) => {
      return Promise.resolve({});
    });
};

export const deleteAssessmentById = (id: string, authorization?: any) => {
  return httpDelete(`/assessment/${id}`, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve({});
    })
    .catch((error) => {
      return Promise.resolve({});
    });
};

export const getAssessmentQuestions = (authorization: any, id: string) => {
  return httpGet(`/assessment/${id}/question`, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      return Promise.resolve([]);
    });
};

export const saveAssessmentQuestions = (
  id: string,
  payload: AssessmentQuestion[],
  authorization?: any
) => {
  return httpPost(`/assessment/${id}/question`, payload, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      return Promise.resolve([]);
    });
};

export const saveAssessmentQuestionById = (
  id: string,
  payload: AssessmentQuestion,
  authorization?: any
) => {
  console.log(payload);
  return httpPut(`/assessment/${id}/question/${payload._id}`, payload, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      return Promise.resolve([]);
    });
};

export const createNewQuestion = (
  id: string,
  payload: AssessmentQuestion,
  authorization?: any
) => {
  return httpPost(`/assessment/${id}/question`, payload, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      return Promise.resolve([]);
    });
};

export const deleteAssessmentQuestionById = (
  id: string,
  payload: AssessmentQuestion,
  authorization?: any
) => {
  return httpDelete(`/assessment/${id}/question/${payload._id}`, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      return Promise.resolve([]);
    });
};

export const generateNewAssessmentQuestion = (
  id: string,
  authorization: any
) => {
  return httpGet(`/assessment/${id}/new-question`, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      return Promise.resolve([]);
    });
};

export const changeAssessmentStatus = (
  id: string,
  status: "Draft" | "Active" | "Paused" | "Closed",
  authorization?: any
) => {
  return httpPost(
    `/assessment/${id}/status/${status}`,
    {},
    {
      headers: {
        Authorization: authorization?.access_token,
      },
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      return Promise.resolve([]);
    });
};

export const generateQuestionsUsingAi = (
  id: string,
  text: string,
  noOfQuestions:number,
  authorization?: any
) => {
  return httpPost(
    `/assessment/${id}/generate-questions/${noOfQuestions}`,
    { text },
    {
      headers: {
        Authorization: authorization?.access_token,
      },
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve([]);
    })
    .catch((error) => {
      return Promise.resolve([]);
    });
};
