import { useMutation } from "@apollo/client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { LOGIN_GET_MESSAGE } from "src/api/cyberConnect/graphql/LoginGetMessage";
import { LOGIN_VERIFY } from "src/api/cyberConnect/graphql/LoginVerify";
import { useAccount, useSignMessage } from "wagmi";

export const useLogin = () => {
  const { address: connectedWalletAddress } = useAccount();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginCb, setLoginCb] = useState<CallableFunction>();

  const { openConnectModal } = useConnectModal();
  const [loginGetMessage] = useMutation(LOGIN_GET_MESSAGE);
  const [loginVerify] = useMutation(LOGIN_VERIFY);

  const [loginMessageToSign, setLoginMessageToSign] = useState<string>();
  const { data: signedMessage, signMessage } = useSignMessage({
    message: loginMessageToSign,
  });

  useEffect(() => {
    isLoggingIn
      ? signedMessage && verifyLogin(signedMessage)
      : setLoginMessageToSign(undefined);
  }, [isLoggingIn, signedMessage]);

  useEffect(() => {
    isLoggingIn &&
      (!connectedWalletAddress && openConnectModal?.(),
      !hasAccessToken() && connectedWalletAddress && signLoginMessage());
  }, [isLoggingIn, connectedWalletAddress]);

  useEffect(() => {
    isLoggingIn &&
      connectedWalletAddress &&
      hasAccessToken() &&
      (setIsLoggingIn(false), console.log(222), loginCb?.());
  }, [isLoggingIn, connectedWalletAddress]);

  const signLoginMessage = async () => {
    const messageResult = await loginGetMessage({
      variables: {
        input: {
          address: connectedWalletAddress,
          domain: "verceltwitter.vercel.app",
        },
      },
    });

    signMessage({ message: messageResult?.data?.loginGetMessage?.message });
  };

  const verifyLogin = async (signedMessage: string) => {
    const accessTokenResult = await loginVerify({
      variables: {
        input: {
          address: connectedWalletAddress,
          domain: "verceltwitter.vercel.app",
          signature: signedMessage,
        },
      },
    });

    localStorage.setItem(
      "cyberConnectAccessToken",
      accessTokenResult?.data?.loginVerify?.accessToken
    );

    setIsLoggingIn(false);
    loginCb?.();
  };

  const hasAccessToken = () => false;
  // !!localStorage.getItem("cyberConnectAccessToken");

  const mbLogin = (cb?: CallableFunction) =>
    new Promise((res) => {
      !connectedWalletAddress || !hasAccessToken()
        ? (setIsLoggingIn(true), setLoginCb(() => cb))
        : res(null);
    });

  return {
    mbLogin,
    isLoggingIn,
  };
};

export default useLogin;
