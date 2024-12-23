import { PublicClientApplication } from "@azure/msal-browser";

  const msalConfig = {
    auth: {
      clientId: "f5853ce4-e4fc-47cc-a41d-2e79a10f4433",
      authority: "https://login.microsoftonline.com/common",
      redirectUri: "http://localhost:3010",
    },
  };
  
  const msalInstance = new PublicClientApplication(msalConfig);
  
  export const initializeMsalInstance = async () => {
      try {
          await msalInstance.initialize();  
          return msalInstance;
      } catch (error) {
          console.error("MSAL initialization failed", error);
          throw error;
      }
  };
  
  export default msalInstance;