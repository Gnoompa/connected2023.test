import { useMemo } from "react";
import { CONDITION_TYPE } from "../conditions/types";

export const useConditions = () => {
  const conditions = useMemo(
    () => ({
      type: CONDITION_TYPE.LENS,
      label: "Lens",
      conditions: [
        {
          label: "Has profile",
          subtitle: "(on-chain)",
          getLabel: () => `Has profile`,
          conditionCode: () => `
            const testResult = await Lit.Actions.checkConditions({conditions: [
              {
                  contractAddress: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
                  standardContractType: "ERC721",
                  chain: "polygon",
                  method: "balanceOf",
                  parameters: [":userAddress"],
                  returnValueTest: {
                    comparator: ">",
                    value: "0",
                  },

              },
            ], authSig, chain: "polygon"})

            if (!testResult) { return LitActions.setResponse({response: "Lens profile ownership is not satisfied"}) }
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
