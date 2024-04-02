import { httpGet } from "@/lib/RestTemplate";

export const getAssessments = (
  authorization?: any
) => {
  return httpGet(`/assessment`, {
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
