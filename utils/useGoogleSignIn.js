import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
// import { useAsyncStorage } from "@react-native-async-storage/async-storage";
// import usePromise from "./usePromise";
// import { TokenResponse } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const getUserInfo = async (token) => {
  try {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await response.json();
    return user;
  } catch (error) {
    // Add your own error handler here
  }
};

export default function useGoogleSignIn() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1026042878948-kbdp0fdpe26o6ktobdqkl3tb8ttqsmqe.apps.googleusercontent.com",
    // iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    expoClientId:
      "1026042878948-4833b8a0396euvjg3jise47eg201homt.apps.googleusercontent.com",
  });
  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      /*/
        response.authentication is a TokenResponse which can be serialised and unserialised.
        It can also be refreshed and stuff.
      /*/
      getUserInfo(response.authentication.accessToken).then(setUserInfo);
    }
  }, [response, token]);

  let onClick = null;
  if (request) {
    onClick = () => promptAsync({});
    if (__DEV__) {
      onClick = () => promptAsync({ useProxy: true });
    }
  }
  return [userInfo, onClick];
}
