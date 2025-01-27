// export const getUserProfile = async (accessToken) => {
//   try {
//     const response = await fetch("https://graph.microsoft.com/v1.0/me", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch user profile");
//     }

//     const data = await response.json();

//     const profileData = {
//       displayName: data.displayName,
//       email: data.mail || data.userPrincipalName,
//       picture: await getUserProfilePicture(accessToken),
//     };

//     return profileData;
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     return null;
//   }
// };

const getUserProfilePicture = async (accessToken) => {
  try {
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/photo/$value",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch profile picture");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return null;
  }
};


export const getUserInfo = async (accessToken) => {
  try {
    const response = await fetch(`http://localhost:4000/userinfo?accessToken=${accessToken}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();

    // const profileData = {
    //   displayName: data.displayName,
    //   email: data.mail || data.userPrincipalName,
    //   picture: await getUserProfilePicture(accessToken),
    // };

    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
