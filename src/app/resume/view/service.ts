import { httpGet } from "@/lib/RestTemplate";

export const getResumeById = (authorization: any, id: string) => {
  return httpGet(`/resume/${id}`, {
    headers: {
      Authorization: authorization?.access_token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        console.log({...response.data, data: JSON.parse(response.data.data)})
        return Promise.resolve({...response.data, data: JSON.parse(response.data.data)});
      }
      return Promise.resolve({});
    })
    .catch((error) => {
      return Promise.resolve({});
    });
};
