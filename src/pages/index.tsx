import { CheckIcon } from "@chakra-ui/icons";
import { Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useEvent from "src/models/cyberConnect/event";
import { useNetwork, useSignMessage } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import ConditionConstructor, {
  SelectedConditions
} from "../components/ConditionConstructor";

export default function Home() {
  const router = useRouter();
  const { signMessageAsync } = useSignMessage();
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
    if (chain?.id == bscTestnet.id) {
      createEvent();
    } else {
      alert("Wrong network. Switch to bsc");
    }
  };

  return (
    <Flex
      flexDirection={"column"}
      width={"50rem"}
      margin={"4rem auto"}
      alignItems={"center"}
      sx={{ gap: "8rem" }}
    >
      <Flex flexDirection={"column"} sx={{ gap: "2rem" }} alignItems={"center"}>
        <Flex sx={{ gap: "2rem" }} alignItems={"center"}>
          <Text
            fontSize={"3rem"}
            fontWeight={"bold"}
            sx={{ whiteSpace: "nowrap" }}
          >
            CONNECTED 2023
          </Text>
          <Image src="/crossIcon.svg" />
          <Image src="/w3elogo.svg" width={"10rem"} />
        </Flex>
        <Text
          fontWeight={"semibold"}
          bg="linear-gradient(90deg, rgba(187, 201, 255, 0.8) 0%, rgba(241, 142, 255, 0.8) 100%)"
          bgClip={"text"}
          mixBlendMode={"normal"}
        >
          decentralized on/off-chain event gating constructor
        </Text>
      </Flex>
      <Flex flexDirection={"column"} sx={{ gap: "4rem" }}>
        <Input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          variant={"flushed"}
          size="lg"
          placeholder="Event name"
          textAlign={"center"}
          w={"40rem"}
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
                  <Text whiteSpace={"nowrap"}>
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
      </Flex>
    </Flex>
  );
}
