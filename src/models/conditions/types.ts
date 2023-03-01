export enum CONDITION_TYPE {
  CYBERCONNECT = "cyberconnect",
  LENS = "lens",
  GUILD = "guild",
  DEGENSCORE = "degenscore",
}

export interface ICondition {
  type: CONDITION_TYPE;
  label: string;
  conditions: {
    htmlElement: (
      selectedOptions: { isActive?: boolean; label: string; value: any }[]
    ) => JSX.Element;
    label: string;
    subtitle?: string;
    access?: {}[];
    multiple?: boolean;
    options?: { isActive?: boolean; label: string; value: any }[];
    conditionIpfs?: string;
  }[];
}
