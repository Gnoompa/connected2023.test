import { Flex, Image } from "@chakra-ui/react";
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
          label: "Guild member",
          subtitle: "(off-chain)",
          conditionIpfs: "",
          multiple: true,
          options: conditionGuildOptions,
          htmlElement: (selectedOptions) => (
            <Flex
              bg={`guildBg`}
              color={`guildColor`}
              fontWeight={"semibold"}
              p=".75rem 1.25rem"
              borderRadius={"md"}
            >
              <Flex gap="1rem">
                <Image src={`/guild.svg`} w="1.25rem" />
                Member of{" "}
                {selectedOptions?.map(({ label }) => label).join(", ")}
              </Flex>
            </Flex>
          ),
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
