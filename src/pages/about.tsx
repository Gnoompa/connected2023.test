import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Flex,
  Image,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from "@chakra-ui/react";

export const AboutPage = () => {
  return (
    <Flex mt="10vh">
      <Tabs variant={"solid-rounded"}>
        <TabList justifyContent={"center"} mb="4rem">
          <Tab>General</Tab>
          <Tab>Technical</Tab>
        </TabList>
        <TabPanels pb="4rem">
          <TabPanel
            display={"flex"}
            flexDir="column"
            gap="6rem"
            alignItems={"center"}
            justifyContent="center"
          >
            <Flex
              flexDir={"column"}
              gap="2rem"
              w={"55rem"}
              maxW={"calc(100vw - 2rem)"}
              align="center"
            >
              <Text fontWeight={"semibold"} fontSize="2rem">
                Usecases
              </Text>
              <Flex
                gap={"2rem"}
                wrap="wrap"
                // alignItems={"center"}
                justify="center"
              >
                <Flex gap="2rem">
                  <Flex
                    w={"25rem"}
                    p="1rem 2rem"
                    flexDir={"column"}
                    gap="1rem"
                    bg="#222"
                    borderRadius={"lg"}
                    border="solid 1px #ffffff29"
                    maxW={"calc(100vw - 2rem)"}
                  >
                    <Link target={"_blank"} href="https://web3events.ai/">
                      <Flex align={"center"} gap="1rem">
                        <Image w="6rem" src="/w3elogo.svg"></Image>
                        <ExternalLinkIcon></ExternalLinkIcon>
                      </Flex>
                    </Link>
                    <Text lineHeight={"1.25rem"}>
                      Gated events, campaign condition checker and many more
                      features coming!
                    </Text>
                  </Flex>
                </Flex>
                <Flex gap="2rem">
                  <Flex
                    w={"25rem"}
                    p="1rem 2rem"
                    flexDir={"column"}
                    gap="1rem"
                    bg=" linear-gradient(87.16deg, #111111 0%, rgba(17, 17, 17, 0.53) 97.64%);"
                    borderRadius={"lg"}
                    border="solid 1px #ffffff29"
                    maxW={"calc(100vw - 2rem)"}
                  >
                    <Image w="6rem" src="/huddle.svg"></Image>
                    <Text lineHeight={"1.25rem"}>
                      Access restriction for video conferences
                    </Text>
                  </Flex>
                </Flex>
                <Flex gap="2rem">
                  <Flex
                    w={"25rem"}
                    p="1rem 2rem"
                    flexDir={"column"}
                    gap="1rem"
                    bg="linear-gradient(87.87deg, #D2E6FF 0%, rgba(255, 255, 255, 0.83) 98.19%);"
                    borderRadius={"lg"}
                    border="solid 1px #ffffff29"
                    maxW={"calc(100vw - 2rem)"}
                  >
                    <Image w="8rem" src="/collabland.svg"></Image>
                    <Text lineHeight={"1.25rem"} color="#222">
                      Telegram and Discord access restriction
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Text fontWeight={"semibold"} fontSize="2rem">
              How it works
            </Text>
            <Flex
              ml={[0, 0, "-20rem"]}
              w={"22rem"}
              maxW={"calc(100vw - 2rem)"}
              pos={"relative"}
            >
              <Flex
                bg="#000000a8"
                backdropFilter={"blur(20px)"}
                borderRadius="16px"
                p="1rem 3rem"
              >
                <Text
                  fontSize={"1.05rem"}
                  fontWeight="semibold"
                  lineHeight="1.5rem"
                >
                  Set up conditions of whoever is eligible for a gating token
                </Text>
              </Flex>
              <Image
                top="-3rem"
                left="2rem"
                w="7rem"
                src="/w3elogo2.svg"
                pos={"absolute"}
                zIndex={-1}
              />
            </Flex>
            <Flex
              ml={[0, 0, "17rem"]}
              w={"22rem"}
              maxW={"calc(100vw - 2rem)"}
              pos={"relative"}
            >
              <Flex
                bg="#000000a8"
                backdropFilter={"blur(20px)"}
                borderRadius="16px"
                p="1rem 3rem"
              >
                <Text
                  fontSize={"1.05rem"}
                  fontWeight="semibold"
                  lineHeight="1.5rem"
                >
                  Users check for eligibility to mint a gating token
                </Text>
              </Flex>
              <Image
                top="-3rem"
                right="2rem"
                w="7rem"
                src="/w3elogo2.svg"
                pos={"absolute"}
                zIndex={-1}
              />
              <Image
                top="-2rem"
                right="8rem"
                w="5rem"
                src="/w3elogo2.svg"
                pos={"absolute"}
                zIndex={-1}
              />
            </Flex>
            <Flex
              ml={[0, 0, "-20rem"]}
              maxW={"calc(100vw - 2rem)"}
              w={"24rem"}
              pos={"relative"}
            >
              <Flex
                bg="#000000a8"
                backdropFilter={"blur(20px)"}
                borderRadius="16px"
                p="1rem 3rem"
              >
                <Text
                  fontSize={"1.05rem"}
                  fontWeight="semibold"
                  lineHeight="1.5rem"
                >
                  Users prove gating token ownership and access retricted
                  service
                </Text>
              </Flex>

              <Image
                top="-3rem"
                left="6rem"
                w="7rem"
                src="/w3elogo2.svg"
                pos={"absolute"}
                zIndex={-1}
              />
              <Image
                top="-2rem"
                left="2rem"
                w="5rem"
                src="/w3elogo2.svg"
                pos={"absolute"}
                zIndex={-1}
              />
              <Image
                top="-1rem"
                left="12rem"
                w="4rem"
                src="/w3elogo2.svg"
                pos={"absolute"}
                zIndex={-1}
              />
            </Flex>
          </TabPanel>
          <TabPanel>
            <Image src="/logicmap.svg" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default AboutPage;
