import { Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import ConditionConstructor, {
  SelectedConditions
} from "../components/ConditionConstructor";

export default function Home() {
  const [selectedConditions, setSelectedConditions] =
    useState<SelectedConditions>({});

  const getSelectedConditionsToDisplay = () =>
    Object.values(selectedConditions)
      .map((conditionConfig) =>
        Object.values(conditionConfig).map((condition) =>
          condition?.originCondition.options
            ? condition.options?.length && condition
            : condition
        )
      )
      .flat()
      .filter(Boolean);

  console.log(getSelectedConditionsToDisplay());

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
        <Text fontWeight={"semibold"}>
          decentralized on/off-chain event gating constructor
        </Text>
      </Flex>
      <Flex flexDirection={"column"} sx={{ gap: "4rem" }}>
        <input
          placeholder="Event name"
          style={{
            width: "40rem",
            maxWidth: "100vw",
            background: "none",
            border: "none",
            fontWeight: "bold",
            outline: "none",
            fontSize: "1.5rem",
            letterSpacing: "1px",
            borderBottom: "1px solid #ffffff8b",
            padding: ".25rem 1rem",
          }}
        ></input>
        <Flex
          flexDirection={"column"}
          alignItems={"flex-start"}
          sx={{ gap: "1rem" }}
        >
          <Flex sx={{ gap: "1rem" }} alignItems={"center"}>
            <Text fontWeight={"semibold"} fontSize="1.15rem">
              Gating conditions:
            </Text>
          </Flex>
          <ConditionConstructor
            conditions={selectedConditions}
            onChange={setSelectedConditions}
          />
          {!!getSelectedConditionsToDisplay().length && (
            <Flex gap="1rem" maxW={"35rem"} wrap="wrap">
              {getSelectedConditionsToDisplay().map(
                (condition) =>
                  condition?.originCondition?.htmlElement?.(
                    condition?.options
                  ) || (
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
                        {condition?.originCondition?.label}
                      </Text>                      
                    </Flex>
                  )
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
