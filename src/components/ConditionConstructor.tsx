import {
  ArrowUpDownIcon,
  ChevronRightIcon,
  CloseIcon,
  Search2Icon
} from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text
} from "@chakra-ui/react";
import { without } from "lodash";

import { useEffect, useState } from "react";
import { CONDITION_TYPE, ICondition } from "src/models/conditions/types";
import { useConditions as useCyberConnectConditions } from "src/models/cyberConnect/conditions";
import { useConditions as useDegenscoreConditions } from "src/models/degenScore/conditions";
import { useConditions as useGuildConditions } from "src/models/guild/conditions";
import { useConditions as useLensConditions } from "src/models/lens/conditions";

export type SelectedConditions = Partial<{
  [key in CONDITION_TYPE]: {
    [conditionIndex: number]: {
      originCondition: ICondition["conditions"][0];
      conditionConfig: ICondition;
      options: ICondition["conditions"][0]["options"];
    };
  };
}>;

export const ConditionConstructor = ({
  onChange,
  conditions: passedConditions = {},
}: {
  onChange: (selectedConditions: SelectedConditions) => any;
  conditions?: SelectedConditions;
}) => {
  const { conditions: guildConditionConfig } = useGuildConditions();
  const { conditions: lensConditionConfig } = useLensConditions();
  const { conditions: degenscoreConditionConfig } = useDegenscoreConditions();
  const { conditions: cyberConnectConditionConfig } =
    useCyberConnectConditions();
  const [conditionConfigs, setConditionConfigs] = useState<ICondition[]>([]);
  const [activeConditions, setActiveConditions] =
    useState<SelectedConditions>(passedConditions);

  const [selectedConditions, setSelectedConditions] =
    useState<SelectedConditions>({});

  useEffect(() => {
    setConditionConfigs([
      cyberConnectConditionConfig,
      lensConditionConfig,
      degenscoreConditionConfig,
      guildConditionConfig,
    ]);
  }, [
    cyberConnectConditionConfig,
    guildConditionConfig,
    lensConditionConfig,
    degenscoreConditionConfig,
  ]);

  useEffect(() => {
    onChange?.(selectedConditions);
  }, [selectedConditions]);

  const onSelectCondition = (
    conditionConfig: ICondition,
    condition: ICondition["conditions"][0],
    option?: object
  ) =>
    ((prevSelectedConditions) =>
      setSelectedConditions({
        ...selectedConditions,
        [conditionConfig.type]: {
          [conditionConfig.conditions.indexOf(condition)]:
            prevSelectedConditions && !option
              ? undefined
              : {
                  originCondition: condition,
                  conditionConfig,
                  options: prevSelectedConditions?.options?.includes(option)
                    ? without(prevSelectedConditions.options, option)
                    : (option && [
                        ...(prevSelectedConditions?.options || []),
                        option,
                      ]) ||
                      [],
                },
        },
      }))(
      selectedConditions?.[conditionConfig.type]?.[
        conditionConfig.conditions.indexOf(condition)
      ]
    );

  const [showConditionOptions, setShowConditionOptions] = useState<
    ICondition["conditions"][0][]
  >([]);

  const [conditionOptionFilters, setConditionOptionFilters] = useState<{
    [conditionIndex: number]: { searchQuery: string };
  }>({});

  const toggleConditionOptions = (condition: ICondition["conditions"][0]) =>
    showConditionOptions.includes(condition)
      ? setShowConditionOptions(without(showConditionOptions, condition))
      : setShowConditionOptions([...showConditionOptions, condition]);

  const getFilteredConditionOptions = (
    conditionConfig: ICondition,
    conditionIndex: number
  ): object[] | undefined => [
    ...((conditionOptionFilters[conditionIndex]
      ? conditionConfig.conditions[conditionIndex].options?.filter((option) =>
          conditionOptionFilters[conditionIndex].searchQuery
            ? new RegExp(
                `^${conditionOptionFilters[conditionIndex].searchQuery}`,
                "ig"
              ).test(option.label)
            : true
        )
      : conditionConfig.conditions[conditionIndex].options) || []),
  ];

  return (
    <Flex gap={"1rem"}>
      {
        <Menu closeOnSelect={false}>
          <MenuButton as={Button}>Add conditions</MenuButton>
          <Portal>
            <MenuList gap={"0rem"}>
              {conditionConfigs.map((conditionConfig, conditionConfigIndex) => (
                <MenuItem key={conditionConfigIndex}>
                  <Menu placement="right" closeOnSelect={false}>
                    {({ onClose }) => (
                      <>
                        <MenuButton
                          bg={`${conditionConfig.type}Bg`}
                          color={`${conditionConfig.type}Color`}
                          fontWeight={"semibold"}
                          p=".75rem 1.25rem"
                          borderRadius={"md"}
                          w="14rem"
                        >
                          <Flex
                            justifyContent="space-between"
                            alignItems={"center"}
                          >
                            <Flex gap="1rem">
                              <Image
                                src={`/${conditionConfig.type}.svg`}
                                w="1.25rem"
                              />
                              {conditionConfig.label}
                            </Flex>
                            <ChevronRightIcon
                              color={`${conditionConfig.type}Color`}
                            />
                          </Flex>
                        </MenuButton>
                        <MenuList>
                          {conditionConfig.conditions.map(
                            (condition, conditionIndex) => (
                              <MenuItem
                                bg={`${conditionConfig.type}Bg`}
                                color={`${conditionConfig.type}Color`}
                                fontWeight={"semibold"}
                                p=".75rem 1.25rem"
                                borderRadius={"md"}
                                onClick={() =>
                                  condition.options
                                    ? toggleConditionOptions(condition)
                                    : (onSelectCondition(
                                        conditionConfig,
                                        condition
                                      ),
                                      onClose())
                                }
                              >
                                <Flex flexDir={"column"} w={"100%"} gap="1rem">
                                  <Flex
                                    justifyContent={"space-between"}
                                    alignItems="center"
                                  >
                                    <Flex flexDir={"column"}>
                                      {condition.label}
                                      <Text
                                        color={`${conditionConfig.type}Color`}
                                        fontWeight={"light"}
                                        fontSize="0.9rem"
                                      >
                                        {condition?.subtitle}
                                      </Text>
                                    </Flex>

                                    {!condition.multiple &&
                                      selectedConditions[
                                        conditionConfig.type
                                      ]?.[conditionIndex] && (
                                        <CloseIcon
                                          color={`${conditionConfig.type}Color`}
                                        />
                                      )}
                                    {condition.options && (
                                      <ArrowUpDownIcon
                                        color={`${conditionConfig.type}Color`}
                                      />
                                    )}
                                  </Flex>
                                  {showConditionOptions.includes(condition) && (
                                    <Flex flexDir={"column"} gap=".5rem">
                                      <InputGroup>
                                        <InputLeftAddon>
                                          <Search2Icon />
                                        </InputLeftAddon>
                                        <Input
                                          autoFocus
                                          value={
                                            conditionOptionFilters[
                                              conditionIndex
                                            ]?.searchQuery
                                          }
                                          placeholder="search"
                                          maxW="8rem"
                                          onClick={(e) => (
                                            e.preventDefault(),
                                            e.stopPropagation()
                                          )}
                                          onChange={(e) =>
                                            setConditionOptionFilters({
                                              [conditionIndex]: {
                                                searchQuery: e.target.value,
                                              },
                                            })
                                          }
                                        ></Input>
                                      </InputGroup>
                                      <Flex flexDir={"column"} gap={".5rem"}>
                                        {getFilteredConditionOptions(
                                          conditionConfig,
                                          conditionIndex
                                        )
                                          ?.splice(0, 4)
                                          .map((option, optionIndex) => (
                                            <Flex
                                              key={optionIndex}
                                              flexDir={"column"}
                                              gap={".5rem"}
                                              onClick={(e) =>
                                                condition.multiple
                                                  ? (e.preventDefault(),
                                                    e.stopPropagation(),
                                                    onSelectCondition(
                                                      conditionConfig,
                                                      condition,
                                                      option
                                                    ))
                                                  : onSelectCondition(
                                                      conditionConfig,
                                                      condition,
                                                      option
                                                    )
                                              }
                                            >
                                              <Flex gap=".5rem">
                                                {condition.multiple && (
                                                  <Checkbox
                                                    isChecked={selectedConditions[
                                                      conditionConfig.type
                                                    ]?.[
                                                      conditionIndex
                                                    ].options?.includes(option)}
                                                  />
                                                )}
                                                <Text
                                                  fontWeight={"light"}
                                                  p={".5rem"}
                                                  maxW="10rem"
                                                >
                                                  {option.label}
                                                </Text>
                                              </Flex>
                                              <Divider />
                                            </Flex>
                                          ))}
                                        {!getFilteredConditionOptions(
                                          conditionConfig,
                                          conditionIndex
                                        )?.length && (
                                          <Text fontSize={"2rem"} m="0 auto">
                                            🤷‍♀️
                                          </Text>
                                        )}
                                        {condition.options?.length > 4 && (
                                          <Text
                                            m="0 auto"
                                            fontSize={".75rem"}
                                            fontWeight="light"
                                          >
                                            {condition.options?.length}+
                                          </Text>
                                        )}
                                      </Flex>
                                    </Flex>
                                  )}
                                </Flex>
                              </MenuItem>
                            )
                          )}
                        </MenuList>
                      </>
                    )}
                  </Menu>
                </MenuItem>
              ))}
            </MenuList>
          </Portal>
        </Menu>
      }
    </Flex>
  );
};

export default ConditionConstructor;
