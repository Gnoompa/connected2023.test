import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Flex, Link } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Nav = () => (
  <Flex
    width={"100%"}
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
    <Link sx={{ textDecoration: "underline" }} fontWeight={"light"} href="/">
      home
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
    <ConnectButton />
  </Flex>
);

export default Nav;
