// App.js or LoginScreen.js
import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { Button, View, Text } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = "451573069324-orp46tj63vsrmqpib24sdbn1ulhj0ol3.apps.googleusercontent.com";
const REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: true,
});

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function GoogleLogin() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
      responseType: "token",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;

      // You can now fetch user info
      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
        .then(res => res.json())
        .then(user => {
          console.log("User Info:", user);
        });
    }
  }, [response]);

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="mb-4 text-xl">Login with Google</Text>
      <Button
        disabled={!request}
        title="Login with Google"
        onPress={() => promptAsync()}
      />
    </View>
  );
}
