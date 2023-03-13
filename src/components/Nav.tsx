import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Flex, Link } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Nav = () => (
  <Flex
    width={"100%"}
    wrap="wrap"
    justifyContent={"flex-end"}
    alignItems={"center"}
    gap={["1.5rem", "3rem"]}
    p={"1rem 2rem"}
  >
    {/* <Link
      sx={{ textDecoration: "underline" }}
      fontWeight={"light"}
      href="/about"
      target="_blank"
    >
      🎉 NFT campaign
    </Link> */}
    <Flex gap={["1.5rem", "3rem"]}>
      <Link sx={{ textDecoration: "underline" }} fontWeight={"light"} href="/">
        home
      </Link>
      <Link
        whiteSpace={"nowrap"}
        sx={{ textDecoration: "underline" }}
        fontWeight={"light"}
        href="https://web3events.ai/"
        target="_blank"
      >
        web3events
        <ExternalLinkIcon ml=".5rem" />
      </Link>
      <Link
        whiteSpace={"nowrap"}
        sx={{ textDecoration: "underline" }}
        fontWeight={"light"}
        href="/about"
        target="_blank"
      >
        about
        <ExternalLinkIcon ml=".5rem" />
      </Link>
    </Flex>
    <ConnectButton />
  </Flex>
);

export default Nav;
