import { useLazyQuery, useMutation } from "@apollo/client";
import { WebBundlr } from "@bundlr-network/client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CREATE_CREATE_PROFILE_TYPED_DATA } from "src/api/cyberConnect/graphql/CreateCreateProfileTypedData";
import { CREATE_REGISTER_ESSENCE_TYPED_DATA } from "src/api/cyberConnect/graphql/CreateRegisterEssenceTypedData";
import { EVENT_PROFILE_BY_HANDLE } from "src/api/cyberConnect/graphql/EventProfileByHandle";
import { LOGIN_GET_MESSAGE } from "src/api/cyberConnect/graphql/LoginGetMessage";
import { LOGIN_VERIFY } from "src/api/cyberConnect/graphql/LoginVerify";
import { RELAY } from "src/api/cyberConnect/graphql/Relay";
import { RELAY_ACTION_STATUS } from "src/api/cyberConnect/graphql/RelayActionStatus";
import { VERIFY_ESSENCE_METADATA } from "src/api/cyberConnect/graphql/VerifyEssenceMetadata";
import { useAccount, useProvider, useSigner, useSignMessage } from "wagmi";

let profilePollingInterval;

export const useEvent = ({
  eventName,
  gatingConditions,
}: {
  eventName: string | undefined;
  gatingConditions: object[];
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [createdEventProfileHandle, setCreatedEventProfileHandle] =
    useState<string>();
  const { address: connectedWalletAddress } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const { openConnectModal } = useConnectModal();
  const [loginGetMessage] = useMutation(LOGIN_GET_MESSAGE);
  const [loginVerify] = useMutation(LOGIN_VERIFY);
  const [queryVerifyEssenceMetadata] = useLazyQuery(VERIFY_ESSENCE_METADATA);
  const [createEssenceTypedData] = useMutation(
    CREATE_REGISTER_ESSENCE_TYPED_DATA
  );
  const [loginMessageToSign, setLoginMessageToSign] = useState<string>();
  const { data: signedMessage, signMessage } = useSignMessage({
    message: loginMessageToSign,
  });
  const [getCreateEventProfileTypedData] = useMutation(
    CREATE_CREATE_PROFILE_TYPED_DATA
  );
  const [queryEventProfileByHandle] = useLazyQuery(EVENT_PROFILE_BY_HANDLE);
  const [relay] = useMutation(RELAY);
  const [queryRelayStatus] = useLazyQuery(RELAY_ACTION_STATUS);

  useEffect(() => {
    isLoggingIn
      ? signedMessage && verifyLogin(signedMessage)
      : setLoginMessageToSign(undefined);
  }, [isLoggingIn, signedMessage]);

  useEffect(() => {
    isLoggingIn &&
      (!connectedWalletAddress && openConnectModal?.(),
      !hasAccessToken() && connectedWalletAddress && login());
  }, [isLoggingIn, connectedWalletAddress]);

  useEffect(() => {
    isLoggingIn &&
      connectedWalletAddress &&
      hasAccessToken() &&
      (createEvent(), setIsLoggingIn(false));
  }, [isLoggingIn, connectedWalletAddress, isCreatingEvent]);

  const login = async () => {
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
      "accessToken",
      accessTokenResult?.data?.loginVerify?.accessToken
    );

    setIsLoggingIn(false);

    isCreatingEvent && createEvent();
  };

  const hasAccessToken = () => !!localStorage.getItem("accessToken");

  const mbLogin = () =>
    new Promise((res) => {
      !connectedWalletAddress || !hasAccessToken()
        ? setIsLoggingIn(true)
        : res(null);
    });

  const createEventProfile = async () => {
    const profileHandle = "web3events" + `${+Date.now()}`.substring(4);

    const createEventProfileTypedDataResponse =
      await getCreateEventProfileTypedData({
        variables: {
          input: {
            avatar:
              "https://ipfs.io/ipfs/bafybeidslprdmrckh73cx5qre2kirr7e7dcij6jqpiae52dit6qcfg6cfy",
            handle: profileHandle,
            metadata: "",
            operator: ethers.constants.AddressZero,
            to: connectedWalletAddress,
          },
        },
      });

    const createProfileRelayResponse = await relay({
      variables: {
        input: {
          typedDataID:
            createEventProfileTypedDataResponse?.data
              ?.createCreateProfileTypedData?.typedDataID,
        },
      },
    });

    await waitForRelay(createProfileRelayResponse?.data?.relay?.relayActionId);

    const gatingConditionsCodeArweaveId = await uploadToArweave(
      `(async () => {${gatingConditions
        ?.map?.((condition) =>
          condition.originCondition.conditionCode(condition.options)
        )
        .join(";")} return true})()`
    );

    const gatingConditionsArweaveId = await uploadToArweave({
      conditions: gatingConditions.map((condition) => ({
        configId: condition.conditionConfig.type,
        conditionId: condition.originCondition.id,
        conditionLabel: condition.originCondition.getLabel(condition.options),
      })),
      code: gatingConditionsCodeArweaveId,
    });

    const metadata = {
      metadata_id: `${+new Date()}`,
      version: "1.0.0",
      app_id: "web3events",
      lang: "en",
      issue_date: new Date().toISOString(),
      content: eventName || "Connected2023 & Web3Events",
      media: [],
      tags: [],
      image:
        "https://ipfs.io/ipfs/bafybeidslprdmrckh73cx5qre2kirr7e7dcij6jqpiae52dit6qcfg6cfy",
      image_data: "",
      name: eventName || "Connected2023 & Web3Events",
      description: `decentralized on/off-chain event gating constructor`,
      animation_url: "",
      external_url: "",
      attributes: [
        {
          trait_type: "gating_conditions",
          value: gatingConditionsArweaveId,
        },
      ],
    };

    // queryVerifyEssenceMetadata({
    //   variables: {
    //     ...metadata,
    //   },
    // });

    const arweaveTxId = await uploadToArweave(metadata);
    // console.log(arweaveTxId);
    // return 1;

    const eventProfile = await queryEventProfileByHandle({
      variables: { handle: profileHandle },
    });

    const essenceDataResponse = await createEssenceTypedData({
      variables: {
        input: {
          middleware: {
            collectPermission: {
              signer: "0x29C25240C364bD9cae5F5FE30EF8591971cE09Ec", // PKP NFT address
            },
          },
          name: "Connected2033 & Web3Events - Gated event",
          profileID: eventProfile.data.profileByHandle.profileID,
          symbol: "W3E",
          tokenURI: "https://arweave.net/" + arweaveTxId,
          transferable: true,
        },
      },
    });

    const signature = await signer?.provider?.send("eth_signTypedData_v4", [
      connectedWalletAddress,
      essenceDataResponse?.data?.createRegisterEssenceTypedData?.typedData
        ?.data,
    ]);

    const relayResponse = await relay({
      variables: {
        input: {
          signature,
          typedDataID:
            essenceDataResponse?.data?.createRegisterEssenceTypedData?.typedData
              ?.id,
        },
      },
    });

    const relayStatus = await waitForRelay(
      relayResponse?.data?.relay?.relayActionId
    );

    !relayStatus && alert("Smth went wrong");

    setIsCreatingEvent(false);

    setCreatedEventProfileHandle(profileHandle);
  };

  const waitForRelay = (relayActionId: string) =>
    new Promise((res) =>
      setTimeout(() => {
        profilePollingInterval = setInterval(
          () =>
            queryRelayStatus({
              fetchPolicy: "network-only",
              variables: { relayActionId },
            }).then(({ data }) => {
              data?.relayActionStatus?.txStatus === "SUCCESS" &&
                (res(true), clearInterval(profilePollingInterval));

              data?.relayActionStatus?.__typename == "RelayActionError" &&
                (res(false), clearInterval(profilePollingInterval));
            }),
          1000
        );
      }, 1500)
    );

  const uploadToArweave = async (data: object | string): Promise<string> => {
    provider.getSigner = () => ethers.Wallet.createRandom(); // disposal signer

    const bundlr = new WebBundlr(
      "https://node2.bundlr.network",
      "matic",
      provider,
      {
        providerUrl: "https://matic-mumbai.chainstacklabs.com",
      }
    );

    await bundlr.ready();

    const tx = await bundlr.upload(JSON.stringify(data), {
      tags: [{ name: "Content-Type", value: "application/json" }],
    });

    return tx.id;
  };

  const createEvent = () => {
    setIsCreatingEvent(true);

    mbLogin().then(createEventProfile);
  };

  return {
    createEvent,
    isLoading: isCreatingEvent,
    error,
    createdEventProfileHandle,
  };
};

export default useEvent;
