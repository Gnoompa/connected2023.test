import { Button, Flex, Link } from "@chakra-ui/react";

export const Nav = () => (
  <Flex
    width={"100%"}
    justifyContent={"flex-end"}
    alignItems={"center"}
    sx={{ gap: "3rem" }}
    p={"1rem 2rem"}
  >
    <Link
      sx={{ textDecoration: "underline" }}
      fontWeight={"light"}
      href="/about"
      target="_blank"
    >
      🎉 NFT campaign
    </Link>
    <Link
      sx={{ textDecoration: "underline" }}
      fontWeight={"light"}
      href="/about"
      target="_blank"
    >
      about
    </Link>
    <Button>connect wallet</Button>
  </Flex>
);

export default Nav;
