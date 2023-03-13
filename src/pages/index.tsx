import { CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, Flex, Image, Input, Link, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DEFAULT_CHAIN } from "src/consts";
import useEvent from "src/models/cyberConnect/event";
import { useNetwork } from "wagmi";
import ConditionConstructor, {
  SelectedConditions
} from "../components/ConditionConstructor";

export default function Home() {
  const router = useRouter();
  const { chain } = useNetwork();
  const [eventName, setEventName] = useState<string>();
  const [selectedConditions, setSelectedConditions] =
    useState<SelectedConditions>({});
  const [selectedConditionsList, setSelectedConditionsList] = useState<{}[]>(
    []
  );
  const {
    createEvent,
    isLoading: isCreatingEvent,
    createdEventProfileHandle,
  } = useEvent({
    eventName,
    gatingConditions: selectedConditionsList,
  });

  // useEffect(() => {
  //   fetch("https://api.cyberconnect.dev/ladon/", {
  //     body: `{query:"query {projectByApiKey(apiKey: "${CYBERCONNECT_KEY}") { balance }}", variables:{}}`,
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     method: "POST",
  //   });
  // }, []);

  useEffect(() => {
    selectedConditions &&
      setSelectedConditionsList(
        Object.values(selectedConditions)
          .map((conditionConfig) =>
            Object.values(conditionConfig).map((condition) =>
              condition?.originCondition.options
                ? condition.options?.length && condition
                : condition
            )
          )
          .flat()
          .filter(Boolean) as {}[]
      );
  }, [selectedConditions]);

  useEffect(() => {
    createdEventProfileHandle &&
      router.push(`/event/${createdEventProfileHandle}`);
  }, [createdEventProfileHandle]);

  const onCreateEventButtonClick = async () => {
    if (chain?.id == DEFAULT_CHAIN.id) {
      createEvent();
    } else {
      alert("Wrong network. Switch to " + DEFAULT_CHAIN.name);
    }
  };

  return (
    <Flex
      pb="4rem"
      flexDirection={"column"}
      width={"50rem"}
      maxW={"calc(100% - 2rem)"}
      margin={"4rem auto"}
      alignItems={"center"}
      gap={["4rem", "8rem"]}
    >
      <Flex flexDirection={"column"} sx={{ gap: "2rem" }} alignItems={"center"}>
        <Flex
          flexDirection={["column", "row"]}
          gap={["1rem", "2rem"]}
          alignItems={"center"}
        >
          <Text
            fontSize={["1.5rem", "3rem"]}
            fontWeight={"bold"}
            sx={{ whiteSpace: "nowrap" }}
          >
            CONNECTED 2023
          </Text>
          <Image src="/crossIcon.svg" />
          <Image src="/w3elogo.svg" width={"10rem"} />
        </Flex>
        <Flex flexDir={"column"} justify="center" align={"center"} gap=".75rem">
          <Text
            fontWeight={"semibold"}
            bg="linear-gradient(90deg, rgba(187, 201, 255, 0.8) 0%, rgba(241, 142, 255, 0.8) 100%)"
            bgClip={"text"}
            fontSize="1.15rem"
            mixBlendMode={"normal"}
            textAlign="center"
          >
            decentralized on/off-chain gating constructor
          </Text>
          <Flex gap=".5rem" align={"center"}>
            <Text
              fontSize={".9rem"}
              fontWeight={"semibold"}
              bg="linear-gradient(90deg, rgba(187, 201, 255, 0.8) 0%, rgba(241, 142, 255, 0.8) 100%)"
              bgClip={"text"}
              mixBlendMode={"normal"}
            >
              powered by
            </Text>
            <Text
              fontSize={"1.25rem"}
              fontWeight={"bold"}
              bg="linear-gradient(90deg, rgb(254, 153, 0) 0%, rgba(255, 149, 0, 0.8) 100%)"
              bgClip={"text"}
              mixBlendMode={"normal"}
            >
              Lit
            </Text>
            <Text
              fontSize={".9rem"}
              fontWeight={"semibold"}
              bg="linear-gradient(90deg, rgba(187, 201, 255, 0.8) 0%, rgba(241, 142, 255, 0.8) 100%)"
              bgClip={"text"}
              mixBlendMode={"normal"}
            >
              and
            </Text>
            <Text
              fontSize={"1.25rem"}
              fontWeight={"bold"}
              bg="linear-gradient(90deg, rgb(255, 255, 255) 0%, rgba(225, 225, 225, 0.8) 100%)"
              bgClip={"text"}
              mixBlendMode={"normal"}
            >
              CyberConnect
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex w={["100%", "70%"]} flexDirection={"column"} gap={"4rem"}>
        <Input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          variant={"flushed"}
          size="lg"
          placeholder="Event name"
          textAlign={"center"}
          w={"100%"}
        ></Input>
        <Flex
          flexDirection={"column"}
          alignItems={"flex-start"}
          sx={{ gap: "1rem" }}
        >
          <Flex sx={{ gap: "1rem" }} alignItems={"center"}>
            <Text fontWeight={"semibold"} fontSize="1.15rem">
              Gating conditions
            </Text>
            <ConditionConstructor
              conditions={selectedConditions}
              onChange={setSelectedConditions}
            />
          </Flex>
          {!!selectedConditionsList.length && (
            <Flex gap="1rem" maxW={"35rem"} wrap="wrap">
              {selectedConditionsList.map((condition) => (
                <Flex
                  boxShadow={"0 5px 10px #222"}
                  bg={`${condition.conditionConfig.type}Bg`}
                  color={`${condition.conditionConfig.type}Color`}
                  fontWeight={"semibold"}
                  gap="1rem"
                  p=".75rem 1.25rem"
                  borderRadius={"md"}
                >
                  <Image
                    src={`/${condition.conditionConfig.type}.svg`}
                    w="1.25rem"
                  />
                  <Text>
                    {condition?.originCondition?.getLabel?.(condition?.options)}
                  </Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Flex>
        <Button
          isLoading={isCreatingEvent}
          disabled={isCreatingEvent}
          onClick={onCreateEventButtonClick}
          leftIcon={<CheckIcon />}
          size="lg"
        >
          Create event
        </Button>
        <Link
          target={"_blank"}
          href={"https://connected2023.test.vercel.app/"}
          fontSize={".9rem"}
          opacity={0.8}
          textAlign={"center"}
          mt="-3rem"
        >
          if stuck try testnet example
          <ExternalLinkIcon ml=".5rem"></ExternalLinkIcon>
        </Link>
      </Flex>
    </Flex>
  );
}
