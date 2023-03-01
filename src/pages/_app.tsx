import Nav from "@/components/Nav";
import "@/styles/globals.css";
import theme from "@/styles/theme";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Flex
        flexDirection={"column"}
        sx={{ columnGap: "4rem" }}
        alignItems={"center"}
        height={"100vh"}
      >
        <Nav />
        <Component {...pageProps} />
      </Flex>
    </ChakraProvider>
  );
}
