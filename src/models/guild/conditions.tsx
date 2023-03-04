import { useEffect, useMemo, useState } from "react";
import { CONDITION_TYPE } from "../conditions/types";

export type Guild = {
  id: number;
  name: string;
};

export const useConditions = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const conditionGuildOptions = useMemo(
    () =>
      guilds.map((guild) => ({
        label: guild.name,
        value: guild.id,
      })),
    [guilds]
  );
  const conditions = useMemo(
    () => ({
      type: CONDITION_TYPE.GUILD,
      label: "Guild.xyz",
      conditions: [
        {
          id: "hasProfile",
          label: "Guild member",
          subtitle: "(off-chain)",
          multiple: true,
          options: conditionGuildOptions,
          conditionCode: (options) => `
            const guilds = await (await fetch("https://api.guild.xyz/v1/user/membership/" + ethers.utils.verifyMessage(authSig.signedMessage, authSig.sig))).json()

            if (guilds && guilds.length && ${JSON.stringify(
              options
            )}.map(option => !!guilds.filter(({guildId}) => guildId == option.value).length).includes(false)) { return LitActions.setResponse({response: "Guild.xyz membership is not satisfied"}) }
          `,
          getLabel: (options) =>
            `Member of ${options?.map(({ label }) => label).join(", ")}`,
        },
      ],
    }),
    [conditionGuildOptions]
  );

  useEffect(() => {
    fetchGuilds();
  }, []);

  const fetchGuilds = () =>
    fetch("https://api.guild.xyz/v1/guild")
      .then((response) => response.json())
      .then(setGuilds);

  return {
    conditions,
  };
};

export default useConditions;
