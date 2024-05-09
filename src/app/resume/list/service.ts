import { httpGet, httpPost } from "@/lib/RestTemplate";
import { Resume } from "@/types/Resume";
import { Authorization } from "@/types/Authorization";

export const getResumes = (authorization?: Authorization) => {
  return httpGet(`/resume`, {
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

export const saveResume = (payload: any, authorization?: any) => {
  const formData = new FormData();
  formData.append("file", payload);
  return httpPost(`/resume`, formData, {
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
