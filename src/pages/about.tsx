import {
    Flex,
    Image,
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
          <TabPanel pt="4rem" ml="10rem">
            <Flex ml="-10rem" w={"22rem"} pos={"relative"}>
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
                  Event host sets up conditions of whoever is eligible for
                  getting a ticket
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
            <Flex mt="4rem" ml="7rem" w={"22rem"} pos={"relative"}>
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
                  Participants visit event page and check for ticket eligibility
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
            <Flex mt="4rem" ml="-10rem" w={"22rem"} pos={"relative"}>
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
                  If a participant is eligible they could get a ticket
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
