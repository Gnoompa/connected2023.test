import { bsc, bscTestnet } from "wagmi/chains";

export const IS_TEST_ENV = true;
export const DEFAULT_CHAIN = IS_TEST_ENV ? bscTestnet : bsc;
export const CYBERCONNECT_KEY = IS_TEST_ENV
  ? "Qnx9FmY6Y1qvw8YNYRdHVpHfP5oA5F4Z"
  : "FkgQOpScPAK1AVBpnZBowugCjNKtlNqN";
// : "LGziMAjTtQK9vuKD3IZxfrJCznBQPZE0"
