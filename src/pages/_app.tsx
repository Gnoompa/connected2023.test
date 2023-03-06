import { ApolloProvider } from "@apollo/client";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { DEFAULT_CHAIN } from "src/consts";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { apolloClient } from "../api/cyberConnect/client";
import Nav from "../components/Nav";
import "../styles/globals.css";
import theme from "../styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    [
      {
        ...DEFAULT_CHAIN,
      },
    ],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "Events",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
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
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
}
