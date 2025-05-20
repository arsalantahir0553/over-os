// src/theme/index.ts
import { extendTheme, theme as base } from "@chakra-ui/react";

const customTheme = extendTheme({
  colors: {
    brand: {
      50: "#e6e9f0",
      100: "#c1c8da",
      200: "#98a4c1",
      300: "#6f80a8",
      400: "#495f91",
      500: "#2f4677",
      600: "#22355d",
      700: "#162542",
      800: "#0a1528",
      900: "#000E39", // your primary
    },
    primary: {
      500: "#2368C4",
    },
  },
  fonts: {
    heading: `'Segoe UI', ${base.fonts?.heading}`,
    body: `'Segoe UI', ${base.fonts?.body}`,
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.800",
      },
    },
  },
  semanticTokens: {
    colors: {
      primary: "brand.900",
    },
  },
});

export default customTheme;
