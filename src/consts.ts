import { bsc, bscTestnet } from "wagmi/chains";

export const IS_TEST_ENV = false;
export const DEFAULT_CHAIN = IS_TEST_ENV ? bscTestnet : bsc;
