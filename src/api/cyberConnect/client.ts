import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.cyberconnect.dev/testnet/",
  // uri: "https://api.cyberconnect.dev/",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");

  return {
    headers: {
      ...headers,
      Authorization: token ? `bearer ${token}` : "",
      "X-API-KEY": "l4fUvdyV1Vyb777TbLNtcGe7sl4aSlrZ",
      // "X-API-KEY": "FkgQOpScPAK1AVBpnZBowugCjNKtlNqN",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
