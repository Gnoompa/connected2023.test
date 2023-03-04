import { useMemo } from "react";
import { CONDITION_TYPE } from "../conditions/types";

export const useConditions = () => {
  const conditions = useMemo(
    () => ({
      type: CONDITION_TYPE.CYBERCONNECT,
      label: "CyberConnect",
      conditions: [
        {
          id: "hasProfile",
          label: "Has profile",
          subtitle: "(on-chain)",
          getLabel: () => `Has profile`,
          conditionCode: () => `
            const testResult = await Lit.Actions.checkConditions({conditions: [
              {
                contractAddress: "0x2723522702093601e6360cae665518c4f63e9da6",
                standardContractType: "ERC721",
                chain: "bsc",
                method: "balanceOf",
                parameters: [":userAddress"],
                returnValueTest: {
                  comparator: ">",
                  value: "0",
                },
              },
            ], authSig, chain: "bsc"})

            if (!testResult) { return LitActions.setResponse({response: "CyberConnect profile ownership is not satisfied"}) }
          `,
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
