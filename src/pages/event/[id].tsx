import { useLazyQuery } from "@apollo/client";
import { Box, Button, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import LitJsSdk from "lit-js-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { EVENT_PROFILE_BY_HANDLE } from "src/api/cyberConnect/graphql/EventProfileByHandle";

export const EventPage = () => {
  const router = useRouter();
  const { id: eventProfileHandle } = router.query;
  const [queryEventProfileByHandle, { data: eventProfile }] = useLazyQuery(
    EVENT_PROFILE_BY_HANDLE
  );
  const eventGatingToken =
    eventProfile?.profileByHandle?.essences?.edges?.[0]?.node;
  const [eventGatingTokenMetadata, setEventGatingTokenMetadata] =
    useState<{}>();
  const [eventGatingTokenConditions, setEventGatingTokenConditions] =
    useState<{}>();

  useEffect(() => {
    eventProfileHandle && fetchEventProfile(eventProfileHandle as string);
  }, [eventProfileHandle]);

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
  console.log(eventGatingTokenConditions);
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

  const onParticipateButtonClick = async () => {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "bsc",
    });

    // const sig = await signMessageAsync({ message: messageToSign });

    const client = new LitJsSdk.LitNodeClient({
      litNetwork: "serrano",
      debug: true,
    });

    await client.connect();

    await client.executeJs({
      ipfsId: "QmcsGamZeTgfrZSgXnME8XWtxa6r8rbPSWTDq5sqDPPjWp",
      authSig,
      jsParams: {
        gatingConditionsUrl:
          "https://ipfs.io/ipfs/bafkreiha5fojssy4wiisbq3i2enoancpr42svnwwivnjxjfaosc44eeboe",
        toSign: Buffer.from("test"),
        authSig,
        publicKey:
          "0x04bb329688a4a6e6865667187890ef2aec083d7c856f6b1d0ff66652a61794975056ff7b9bde2bdf592c3a2a8556aa5a8050732bc9fcdae3065be84ce1bdc03b26",
        sigName: "sig1",
      },
    });
  };

  return eventGatingTokenMetadata ? (
    <Flex gap="4rem" mt="10vh">
      <Flex pos={"relative"}>
        <Image
          zIndex={1}
          src="https://ipfs.io/ipfs/bafybeidslprdmrckh73cx5qre2kirr7e7dcij6jqpiae52dit6qcfg6cfy"
          w="20rem"
          borderRadius={"16px"}
          border="1px solid #54545452"
        />
        <Box pos={"absolute"} w="25rem">
          <Image
            pos={"absolute"}
            src="https://ipfs.io/ipfs/bafybeidslprdmrckh73cx5qre2kirr7e7dcij6jqpiae52dit6qcfg6cfy"
            w="25rem"
            top={"-2.5rem"}
            left="-2.5rem"
            borderRadius={"16px"}
            filter="blur(40px)"
          />
        </Box>
      </Flex>

      <Flex gap="2rem" flexDir={"column"} align="flex-start" justify="center">
        <Text fontSize={"2xl"} fontWeight="bold">
          {eventGatingTokenMetadata.name}
        </Text>
        {eventGatingTokenConditions && (
          <Flex gap="1rem" flexDir={"column"}>
            <Text fontWeight={"semibold"} fontSize="lg" opacity={0.9}>
              Gating conditions
            </Text>
            <Flex>
              <Flex gap="1rem" maxW={"35rem"} wrap="wrap">
                {eventGatingTokenConditions.conditions.map((condition) => (
                  <Flex
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
          disabled={!eventGatingToken || !eventGatingTokenMetadata}
          onClick={onParticipateButtonClick}
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
