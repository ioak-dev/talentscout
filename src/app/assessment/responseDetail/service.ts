import { httpGet, httpPost } from "@/lib/RestTemplate";
import { Authorization } from "@/types/Authorization";

export const getResponseDetail = (
  id: any,
  responseId: any,
  authorization?: Authorization
) => {
  return httpGet(`/assessment/${id}/response-detail/${responseId}`, {
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

export const getUserDetails = (
  id: any,
  responseId: any,
  authorization?: Authorization
) => {
  return httpGet(`/assessment/${id}/response/${responseId}`, {
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
// assessment/:id/response/:responseId 