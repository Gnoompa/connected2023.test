import { useLazyQuery, useMutation } from "@apollo/client";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import LitJsSdk from "lit-js-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CREATE_COLLECT_ESSENCE_TYPED_DATA } from "src/api/cyberConnect/graphql/CreateCollectEssenceTypedData";

import { EVENT_PROFILE_BY_HANDLE } from "src/api/cyberConnect/graphql/EventProfileByHandle";
import { RELAY } from "src/api/cyberConnect/graphql/Relay";
import { RELAY_ACTION_STATUS } from "src/api/cyberConnect/graphql/RelayActionStatus";
import useLogin from "src/models/cyberConnect/login";
import { useAccount, useContractRead, useSigner } from "wagmi";
import ABI from "../../models/cyberConnect/abi";

let profilePollingInterval;

export const EventPage = () => {
  const router = useRouter();
  const { data: signer } = useSigner();
  const { address: connectedWalletAddress } = useAccount();
  const { id: eventProfileHandle } = router.query;
  const { mbLogin } = useLogin();
  const [queryEventProfileByHandle, { data: eventProfile }] = useLazyQuery(
    EVENT_PROFILE_BY_HANDLE
  );
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

  const { data: PKPNFTnonce, refetch: refetchPKPNFTnonce } = useContractRead({
    address: "0x57e12b7a5f38a7f9c23ebd0400e6e53f2a45f271",
    abi: ABI,
    functionName: "nonces",
    args: ["0x29C25240C364bD9cae5F5FE30EF8591971cE09Ec"],
  });

  useEffect(() => {
    eventProfileHandle && fetchEventProfile(eventProfileHandle as string);
  }, [eventProfileHandle]);

  useEffect(() => {}, [isSuccess]);

  useEffect(() => {
    eventGatingToken &&
      fetchEventGatingTokenMetadata(eventGatingToken.tokenURI);
  }, [eventGatingToken]);

  useEffect(() => {
    eventGatingTokenMetadata && fetchEventGatingTokenConditions();
  }, [eventGatingTokenMetadata]);

  useEffect(() => {
    eventProfile &&
      !eventProfile?.profileByHandle?.essences?.edges?.length &&
      queryEventProfileByHandle({
        variables: { handle: eventProfileHandle },
        fetchPolicy: "network-only",
      });
  }, [eventProfile]);

  const fetchEventGatingTokenMetadata = (uri: string) => {
    fetch(uri)
      .then((response) => response.json())
      .then(setEventGatingTokenMetadata);
  };

  const fetchEventGatingTokenConditions = () => {
    fetch("https://arweave.net/" + eventGatingTokenMetadata.attributes[0].value)
      .then((response) => response.json())
      .then(setEventGatingTokenConditions);
  };

  const fetchEventProfile = (eventProfileHandle: string) =>
    queryEventProfileByHandle({ variables: { handle: eventProfileHandle } });

  const participate = async () => {
    try {
      const TypedDataUtils = {
        encodeDigest(typedData) {
          const eip191Header = ethers.utils.arrayify("0x1901");
          const domainHash = TypedDataUtils.hashStruct(
            typedData,
            "EIP712Domain",
            typedData.domain
          );
          const messageHash = TypedDataUtils.hashStruct(
            typedData,
            typedData.primaryType,
            typedData.message
          );

          const pack = ethers.utils.solidityPack(
            ["bytes", "bytes32", "bytes32"],
            [eip191Header, zeroPad(domainHash, 32), zeroPad(messageHash, 32)]
          );

          const hashPack = ethers.utils.keccak256(pack);
          return ethers.utils.arrayify(hashPack);
        },

        encodeData(typedData, primaryType, data) {
          const types = typedData.types;
          const args = types[primaryType];
          if (!args || args.length === 0) {
            throw new Error("TypedDataUtils: type is not unknown");
          }

          const abiCoder = new ethers.utils.AbiCoder();
          const abiTypes = [];
          const abiValues = [];

          const typeHash = TypedDataUtils.typeHash(
            typedData.types,
            primaryType
          );
          abiTypes.push("bytes32");
          abiValues.push(zeroPad(typeHash, 32));

          const encodeField = (name, type, value) => {
            if (types[type] !== undefined) {
              return [
                "bytes32",
                ethers.utils.arrayify(
                  ethers.utils.keccak256(
                    TypedDataUtils.encodeData(typedData, type, value)
                  )
                ),
              ];
            }

            if (type === "bytes" || type === "string") {
              let v;
              if (type === "string") {
                v = ethers.utils.toUtf8Bytes(value);
              } else {
                v = ethers.utils.arrayify(value);
              }
              return [
                "bytes32",
                ethers.utils.arrayify(
                  ethers.utils.hexZeroPad(ethers.utils.keccak256(v), 32)
                ),
              ];
            } else if (type.lastIndexOf("[") > 0) {
              const t = type.slice(0, type.lastIndexOf("["));
              const v = value.map((item) => encodeField(name, t, item));
              return [
                "bytes32",
                ethers.utils.arrayify(
                  ethers.utils.keccak256(
                    ethers.utils.arrayify(
                      abiCoder.encode(
                        v.map(([tt]) => tt),
                        v.map(([, vv]) => vv)
                      )
                    )
                  )
                ),
              ];
            } else {
              return [type, value];
            }
          };

          for (const field of args) {
            const [type, value] = encodeField(
              field.name,
              field.type,
              data[field.name]
            );
            abiTypes.push(type);
            abiValues.push(value);
          }

          return ethers.utils.arrayify(abiCoder.encode(abiTypes, abiValues));
        },

        hashStruct(typedData, primaryType, data) {
          return ethers.utils.arrayify(
            ethers.utils.keccak256(
              TypedDataUtils.encodeData(typedData, primaryType, data)
            )
          );
        },

        typeHash(typedDataTypes, primaryType) {
          return ethers.utils.arrayify(
            ethers.utils.keccak256(
              ethers.utils.toUtf8Bytes(
                TypedDataUtils.encodeType(typedDataTypes, primaryType)
              )
            )
          );
        },

        encodeType(typedDataTypes, primaryType) {
          const args = typedDataTypes[primaryType];
          if (!args || args.length === 0) {
            throw new Error("TypedDataUtils: type is not defined");
          }

          const subTypes = [];
          let s = primaryType + "(";

          for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const arrayArg = arg.type.indexOf("[");
            const argType =
              arrayArg < 0 ? arg.type : arg.type.slice(0, arrayArg);

            if (typedDataTypes[argType] && typedDataTypes[argType].length > 0) {
              let set = false;
              for (let x = 0; x < subTypes.length; x++) {
                if (subTypes[x] === argType) {
                  set = true;
                }
              }
              if (!set) {
                subTypes.push(argType);
              }
            }

            s += arg.type + " " + arg.name;
            if (i < args.length - 1) {
              s += ",";
            }
          }
          s += ")";

          subTypes.sort();
          for (let i = 0; i < subTypes.length; i++) {
            const subEncodeType = TypedDataUtils.encodeType(
              typedDataTypes,
              subTypes[i]
            );
            s += subEncodeType;
          }

          return s;
        },

        domainType(domain) {
          const type = [];
          if (domain.name) {
            type.push({ name: "name", type: "string" });
          }
          if (domain.version) {
            type.push({ name: "version", type: "string" });
          }
          if (domain.chainId) {
            type.push({ name: "chainId", type: "uint256" });
          }
          if (domain.verifyingContract) {
            type.push({ name: "verifyingContract", type: "address" });
          }
          if (domain.salt) {
            type.push({ name: "salt", type: "bytes32" });
          }
          return type;
        },

        buildTypedData(domain, messageTypes, primaryType, message) {
          const domainType = TypedDataUtils.domainType(domain);

          const typedData = {
            domain: domain,
            types: {
              EIP712Domain: domainType,
              ...messageTypes,
            },
            primaryType: primaryType,
            message: message,
          };

          return typedData;
        },
      };

      const encodeTypedDataDigest = (typedData) => {
        return TypedDataUtils.encodeDigest(typedData);
      };

      const buildTypedData = (domain, messageTypes, primaryType, message) => {
        return TypedDataUtils.buildTypedData(
          domain,
          messageTypes,
          primaryType,
          message
        );
      };

      const domainType = (domain) => {
        return TypedDataUtils.domainType(domain);
      };

      // zeroPad is implemented as a compat layer between ethers v4 and ethers v5
      const zeroPad = (value, length) => {
        return ethers.utils.arrayify(
          ethers.utils.hexZeroPad(ethers.utils.hexlify(value), length)
        );
      };

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
          name: "Link3",
          version: "1",
          chainId: "0x61",
          verifyingContract: "0x57e12b7a5F38A7F9c23eBD0400e6E53F2a45F271",
        },
        message: {
          to: connectedWalletAddress,
          essenceId:
            eventProfile?.profileByHandle?.essences?.edges[0].node.essenceID,
          profileId: eventProfile.profileByHandle.profileID,
          nonce: typedData.message.nonce,
          deadline: typedData.message.deadline,
        },
      };

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
        chain: "bscTestnet",
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

      const collectEssenceData2 = await createEssenceTypedData({
        variables: {
          input: {
            collector: connectedWalletAddress,
            profileID: eventProfile.profileByHandle.profileID,
            essenceID:
              eventProfile?.profileByHandle?.essences?.edges[0].node.essenceID,
            preData: signatures.signatures.sig1.signature,
            // options: {
            //   overrideNonce: 0,
            // },
          },
        },
      });

      const connectedWalletSignature = await signer?.provider?.send(
        "eth_signTypedData_v4",
        [
          connectedWalletAddress,
          collectEssenceData2?.data?.createCollectEssenceTypedData?.typedData
            .data,
        ]
      );

      console.log(signatures);

      console.log(
        ethers.utils.recoverAddress(
          modifiedTypedData,
          signatures.signatures.sig1.signature
        )
      );

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
      setIsSuccess(true);
    } catch (e) {
      alert("smth went wrong");

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
    <Flex gap="4rem" mt="10vh">
      <Flex pos={"relative"}>
        <Image
          zIndex={1}
          src="https://storage.fleek.zone/11bba0e3-a1bd-4894-a62d-0659871bbb90-bucket/connected2023_2.png"
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
            src="https://storage.fleek.zone/11bba0e3-a1bd-4894-a62d-0659871bbb90-bucket/connected2023_2.png"
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
      >
        <Text fontSize={"2xl"} fontWeight="bold">
          {eventGatingTokenMetadata.name}
        </Text>
        {eventGatingTokenConditions && (
          <Flex gap="1rem" flexDir={"column"}>
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
                    <Text whiteSpace={"nowrap"}>
                      {condition.conditionLabel}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Flex>
        )}
        <Button
          isLoading={isProcessing}
          disabled={!eventGatingToken || !eventGatingTokenMetadata}
          onClick={onParticipateButtonClick}
          rightIcon={<ArrowForwardIcon />}
        >
          Participate
        </Button>
      </Flex>
    </Flex>
  ) : (
    <Spinner mt="20vh" />
  );
};

export default EventPage;
