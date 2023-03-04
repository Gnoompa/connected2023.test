import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    cyberconnectBg: "linear-gradient(93deg, #FFFFFF 2.53%, #DEDEDE 100%)",
    cyberconnectColor: "#111",
    guildBg: "linear-gradient(93deg, #2D2D2D 2.53%, #505050 100%)",
    guildColor: "#fff",
    lensBg: "linear-gradient(90deg, #ABFE2C 0%, #DDFFA8 100%);",
    lensColor: "#00501E",
    degenscoreBg: "linear-gradient(87deg, #171717 0%, #111111 97.51%)",
    degenscoreColor: "#d4bcff",
  },
  styles: {
    global: {
      body: {
        fontFamily: "'Lexend', sans-serif;",
        bg: "linear-gradient(231.63deg, #2A3048 0%, #301134 103.69%)",
      },
    },
  },
  components: {
    Menu: {
      baseStyle: ({ theme }) => ({
        button: {
          ...theme.components.Button.variants.solid(
            theme.components.Button.defaultProps
          ),
          _hover: {},
          _active: {},
        },
        list: {
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
          bg: "transparent",
          border: "none",
          boxShadow: "none",
        },
        item: {
          bg: "transparent",
        },
      }),
    },
  },
});

export default theme;
