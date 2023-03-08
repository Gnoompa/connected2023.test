import { useLazyQuery, useMutation } from "@apollo/client";
import {
  ArrowForwardIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Image,
  Spinner,
  Text,
  useClipboard
} from "@chakra-ui/react";
import { ethers } from "ethers";
import LitJsSdk from "lit-js-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Link } from "rebass";
import { CREATE_COLLECT_ESSENCE_TYPED_DATA } from "src/api/cyberConnect/graphql/CreateCollectEssenceTypedData";

import { EVENT_PROFILE_BY_HANDLE } from "src/api/cyberConnect/graphql/EventProfileByHandle";
import { RELAY } from "src/api/cyberConnect/graphql/Relay";
import { RELAY_ACTION_STATUS } from "src/api/cyberConnect/graphql/RelayActionStatus";
import { DEFAULT_CHAIN, IS_TEST_ENV } from "src/consts";
import { TypedDataUtils } from "src/lib/utils/typedData";
import useLogin from "src/models/cyberConnect/login";
import { useAccount, useContractRead, useSigner } from "wagmi";
import ABI from "../../models/cyberConnect/abi";

let profilePollingInterval;
let initialProfilePollingInterval;

export const EventPage = () => {
  const router = useRouter();
  const { data: signer } = useSigner({chainId: DEFAULT_CHAIN.id});
  const { address: connectedWalletAddress } = useAccount();
  const { id: eventProfileHandle } = router.query;
  const { mbLogin } = useLogin();
  const [queryEventProfileByHandle, { data: eventProfile }] = useLazyQuery(
    EVENT_PROFILE_BY_HANDLE
  );
  const {
    onCopy,
    value: copyValue,
    setValue: setCopyValue,
    hasCopied,
  } = useClipboard("");
  const isEventProfileAbsent =
    eventProfile && !eventProfile?.profileByHandle?.essences?.edges?.length;
  const eventGatingToken =
    eventProfile?.profileByHandle?.essences?.edges?.[0]?.node;
  const [eventGatingTokenMetadata, setEventGatingTokenMetadata] =
    useState<{}>();
  const [eventGatingTokenConditions, setEventGatingTokenConditions] =
    useState<{}>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createEssenceTypedData] = useMutation(
    CREATE_COLLECT_ESSENCE_TYPED_DATA
  );
  const [relay] = useMutation(RELAY);
  const [queryRelayStatus] = useLazyQuery(RELAY_ACTION_STATUS);

  const profileEssence =
    eventProfile?.profileByHandle?.essences?.edges?.[0]?.node;

  const openseaLink = IS_TEST_ENV
    ? `https://testnets.opensea.io/assets/bsc-testnet/${profileEssence?.contractAddress}`
    : `https://opensea.io/assets/bsc/${profileEssence?.contractAddress}`;

  const { data: PKPNFTnonce, refetch: refetchPKPNFTnonce } = useContractRead({
    address: "0x57e12b7a5f38a7f9c23ebd0400e6e53f2a45f271",
    abi: ABI,
    functionName: "nonces",
    args: ["0x29C25240C364bD9cae5F5FE30EF8591971cE09Ec"],
  });

  useEffect(() => {
    eventProfileHandle && fetchEventProfile(eventProfileHandle as string);
  }, [eventProfileHandle]);

  useEffect(() => {
    copyValue && onCopy();
  }, [copyValue]);

  useEffect(() => {
    isSuccess && setTimeout(() => setIsSuccess(false), 7000);
  }, [isSuccess]);

  useEffect(() => {
    eventGatingToken &&
      fetchEventGatingTokenMetadata(eventGatingToken.tokenURI);
  }, [eventGatingToken]);

  useEffect(() => {
    eventGatingTokenMetadata && fetchEventGatingTokenConditions();
  }, [eventGatingTokenMetadata]);

  const fetchEventGatingTokenMetadata = (uri: string) => {
    fetch(uri)
      .then((response) => response.json())
      .then(setEventGatingTokenMetadata);
  };

  console.log(signer)

  const fetchEventGatingTokenConditions = () => {
    fetch("https://arweave.net/" + eventGatingTokenMetadata.attributes[0].value)
      .then((response) => response.json())
      .then(setEventGatingTokenConditions);
  };

  const fetchEventProfile = (eventProfileHandle: string) =>
    queryEventProfileByHandle({
      variables: { handle: eventProfileHandle },
      fetchPolicy: "network-only",
    });

  const participate = async () => {
    try {
      setIsProcessing(true);

      const collectEssenceData = await createEssenceTypedData({
        variables: {
          input: {
            collector: connectedWalletAddress,
            profileID: eventProfile.profileByHandle.profileID,
            essenceID:
              eventProfile?.profileByHandle?.essences?.edges[0].node.essenceID,
            // options: {
            //   overrideNonce: 0,
            // },
          },
        },
      });

      const typedData = JSON.parse(
        collectEssenceData.data.createCollectEssenceTypedData.typedData.data
      );

      const permissionMwPreData = {
        types: {
          EIP712Domain: [
            {
              name: "name",
              type: "string",
            },
            {
              name: "version",
              type: "string",
            },
            {
              name: "chainId",
              type: "uint256",
            },
            {
              name: "verifyingContract",
              type: "address",
            },
          ],
          mint: [
            {
              name: "to",
              type: "address",
            },
            {
              name: "profileId",
              type: "uint256",
            },
            {
              name: "essenceId",
              type: "uint256",
            },
            {
              name: "nonce",
              type: "uint256",
            },
            {
              name: "deadline",
              type: "uint256",
            },
          ],
        },
        primaryType: "mint",
        domain: {
          name: "CollectPermissionMw",
          version: "1",
          chainId: DEFAULT_CHAIN.id,
          verifyingContract: IS_TEST_ENV
            ? "0xbbbab0257edba5823ddb5aa62c08f07bd0d302d9"
            : "0x01fafdbfbb1a56d4a58bb1f7472fb866922ff6c4",
        },
        message: {
          to: connectedWalletAddress,
          essenceId:
            eventProfile?.profileByHandle?.essences?.edges[0].node.essenceID,
          profileId: eventProfile.profileByHandle.profileID,
          nonce: 0,
          deadline: typedData.message.deadline,
        },
      };

      console.log(permissionMwPreData);

      const { data: nonce } = await refetchPKPNFTnonce();

      // const modifiedTypedData = {
      //   ...typedData,
      //   message: {
      //     ...typedData.message,
      //     // nonce: nonce._hex,
      //     nonce: "0x0c",
      //   },
      // };

      const modifiedTypedData = TypedDataUtils.encodeDigest({
        ...typedData,
        message: {
          ...typedData.message,
          // nonce: nonce._hex,
          // nonce: "0x00",
        },
      });

      // const modifiedTypedData = typedData;

      // return 1;

      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: IS_TEST_ENV ? "bscTestnet" : "bsc",
      });

      // const sig = await signMessageAsync({ message: messageToSign });

      const client = new LitJsSdk.LitNodeClient({
        litNetwork: "serrano",
        debug: true,
      });

      await client.connect();

      const signatures = await client.executeJs({
        // code: `
        // const go = async () => {
        //   const resp = await (await fetch(gatingConditionsUrl)).text();

        //   const conditionResult = await eval(eval(resp)); // ikr

        //   console.log(conditionResult);

        //   if (conditionResult === true) {
        //     const sigShare = await LitActions.signEcdsa({ toSign, publicKey , sigName });
        //   }
        // };

        // go()
        // `,
        ipfsId: "QmT4KeHeR13UuLt9WVK8kKwrLBUYyqw45oEdgngrsBnBa4",
        authSig,
        jsParams: {
          gatingConditionsUrl:
            "https://arweave.net/" + eventGatingTokenConditions.code,
          toSign: TypedDataUtils.encodeDigest(permissionMwPreData),
          authSig,
          publicKey:
            "0x04bb329688a4a6e6865667187890ef2aec083d7c856f6b1d0ff66652a61794975056ff7b9bde2bdf592c3a2a8556aa5a8050732bc9fcdae3065be84ce1bdc03b26",
          sigName: "sig1",
        },
      });

      if (!signatures.signatures.sig1?.signature) {
        throw new Error(signatures.response);
      }

      const splitSig = ethers.utils.splitSignature(
        signatures.signatures.sig1.signature
      );

      console.log(
        "NEW SIG",
        ethers.utils.defaultAbiCoder.encode(
          ["uint8", "bytes32", "bytes32", "uint256"],
          [splitSig.v, splitSig.r, splitSig.s, typedData.message.deadline]
        )
      );

      // return 1;

      console.log(
        signatures.signatures.sig1.signature,
        ethers.utils.recoverAddress(
          TypedDataUtils.encodeDigest(permissionMwPreData),
          signatures.signatures.sig1.signature
        )
      );

      // return 11;

      const collectEssenceData2 = await createEssenceTypedData({
        variables: {
          input: {
            collector: connectedWalletAddress,
            profileID: eventProfile.profileByHandle.profileID,
            essenceID:
              eventProfile?.profileByHandle?.essences?.edges[0].node.essenceID,
            preData: ethers.utils.defaultAbiCoder.encode(
              ["uint8", "bytes32", "bytes32", "uint256"],
              [splitSig.v, splitSig.r, splitSig.s, typedData.message.deadline]
            ),
            // options: {
            //   overrideNonce: 0,
            // },
          },
        },
      });

      console.log(signer)

      const connectedWalletSignature = await signer?.provider?.send(
        "eth_signTypedData_v4",
        [
          connectedWalletAddress,
          collectEssenceData2?.data?.createCollectEssenceTypedData?.typedData
            .data,
        ]
      );

      console.log(
        "SENDER SIG",
        connectedWalletSignature,
        ethers.utils.splitSignature(connectedWalletSignature)
      );

      console.log("LIT SIG", signatures);

      // return 1;

      const relayResponse = await relay({
        variables: {
          input: {
            signature: connectedWalletSignature,
            typedDataID:
              collectEssenceData2?.data?.createCollectEssenceTypedData
                ?.typedData?.id,
          },
        },
      });

      const relayStatus = await waitForRelay(
        relayResponse?.data?.relay?.relayActionId
      );

      if (!relayStatus) {
        throw new Error("Unable to mint NFT");
      }

      setIsProcessing(false);

      await fetchEventProfile(eventProfileHandle as string);

      setIsSuccess(true);
    } catch (e) {
      alert("Unable to participate: " + (e?.message || "weird error"));

      setIsProcessing(false);

      console.error(e);
    }
  };

  const onParticipateButtonClick = async () => {
    mbLogin(participate).then(participate);
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

  return eventGatingTokenMetadata ? (
    <Flex
      flexDir={["column", "column", "row"]}
      gap={["2rem", "4rem"]}
      mt="10vh"
      align={"center"}
    >
      <Flex pos={"relative"}>
        <Image
          zIndex={1}
          src="https://ipfs.io/ipfs/bafybeidslprdmrckh73cx5qre2kirr7e7dcij6jqpiae52dit6qcfg6cfy"
          fallback={
            <Flex w="20rem" h="20rem" align={"center"} justify="center">
              <Spinner />
            </Flex>
          }
          w="20rem"
          borderRadius={"16px"}
          border="1px solid #54545452"
        />
        <Box pos={"absolute"} w="25rem">
          <Image
            pos={"absolute"}
            src="https://ipfs.io/ipfs/bafybeidslprdmrckh73cx5qre2kirr7e7dcij6jqpiae52dit6qcfg6cfy"
            w="23rem"
            fallback={<></>}
            top={"-1.5rem"}
            left="-1.5rem"
            borderRadius={"16px"}
            filter="blur(30px)"
          />
        </Box>
      </Flex>

      <Flex
        mt="2rem"
        gap="2rem"
        flexDir={"column"}
        align="flex-start"
        justify="flex-start"
        maxW={"calc(100% - 2rem)"}
        pb="4rem"
      >
        <Flex flexDir={"column"} gap=".25rem">
          <Text
            w="100%"
            fontSize={"2xl"}
            fontWeight="bold"
            textAlign={["center", "initial"]}
          >
            {eventGatingTokenMetadata.name}
          </Text>
          <Flex
            gap=".5rem"
            align={"center"}
            cursor={"pointer"}
            onClick={() => setCopyValue(profileEssence?.contractAddress)}
            alignSelf="flex-start"
          >
            <Text fontSize={[".65rem", ".9rem"]} opacity={0.8}>
              {profileEssence?.contractAddress}
            </Text>
            <CopyIcon />
            <CheckIcon opacity={+!!hasCopied} />
          </Flex>
        </Flex>
        {eventGatingTokenConditions && (
          <Flex gap=".5rem" flexDir={"column"}>
            <Text fontWeight={"semibold"} opacity={0.9}>
              Gating conditions
            </Text>
            <Flex>
              <Flex gap="1rem" maxW={"35rem"} wrap="wrap">
                {eventGatingTokenConditions.conditions.map((condition) => (
                  <Flex
                    boxShadow={"0 5px 10px #222"}
                    bg={`${condition.configId}Bg`}
                    color={`${condition.configId}Color`}
                    fontWeight={"semibold"}
                    gap="1rem"
                    p=".75rem 1.25rem"
                    borderRadius={"md"}
                  >
                    <Image src={`/${condition.configId}.svg`} w="1.25rem" />
                    <Text>{condition.conditionLabel}</Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Flex>
        )}
        <Button
          alignSelf={["center", "flex-start"]}
          isLoading={isProcessing}
          disabled={!eventGatingToken || !eventGatingTokenMetadata}
          onClick={onParticipateButtonClick}
          rightIcon={<ArrowForwardIcon />}
        >
          Participate
        </Button>
      </Flex>
      {isSuccess && (
        <Alert
          status="success"
          variant="subtle"
          pos={"fixed"}
          top="2rem"
          left="50%"
          width={"50vw"}
          transform={"translateX(-50%)"}
          zIndex="overlay"
        >
          <AlertIcon />
          All done! &nbsp;
          <Flex align={"center"}>
            NFT will shortly show&nbsp;
            <Link href={openseaLink} target="_blank">
              <Flex align={"center"} gap=".5rem">
                <Text textDecor="underline"> here</Text>
                <ExternalLinkIcon />
              </Flex>
            </Link>
          </Flex>
        </Alert>
      )}
    </Flex>
  ) : isEventProfileAbsent ? (
    <Text mt="10rem" fontSize={"1.25rem"} fontWeight="semibold">
      No such event
    </Text>
  ) : (
    <Spinner mt="20vh" />
  );
};

export default EventPage;
