import * as chain from "@wagmi/core/chains";
import { useMemo } from "react";
import { CONDITION_TYPE } from "../conditions/types";

export const useConditions = () => {
  const conditions = useMemo(
    () => ({
      type: CONDITION_TYPE.DEGENSCORE,
      label: "DegenScore",
      conditions: [
        {
          label: "Holds CCProfile",
          access: [
            {
              contractAddress: "0x2723522702093601e6360cae665518c4f63e9da6",
              standardContractType: "ERC721",
              chain: chain.mainnet.id,
              method: "balanceOf",
              parameters: [":userAddress"],
              returnValueTest: {
                comparator: ">",
                value: "0",
              },
            },
          ],
        },
      ],
    }),
    []
  );

  return {
    conditions,
  };
};

export default useConditions;
