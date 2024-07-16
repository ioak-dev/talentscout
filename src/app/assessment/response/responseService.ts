import { httpGet, httpPost } from "@/lib/RestTemplate";
import { Authorization } from "@/types/Authorization";


export const getResponses = (id:any,authorization?: Authorization) => {
    return httpGet(`/assessment/${id}/response`, {
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