import { bsc, bscTestnet } from "wagmi/chains";

export const IS_TEST_ENV = process.env.NODE_ENV !== "production";
export const DEFAULT_CHAIN = IS_TEST_ENV ? bscTestnet : bsc;
