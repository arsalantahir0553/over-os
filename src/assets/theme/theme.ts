import { extendTheme, theme as base, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const customTheme = extendTheme({
  config,
  colors: {
    brand: {
      1000: "#0F162B",
      900: "#0F122B", // GitHub dark background
      800: "#161B22", // Dark section cards
      700: "#1F2937", // Sidebar/nav
      600: "#2D3748",
      500: "#3B82F6", // Soft bright blue
      400: "#60A5FA",
    },
    neon: {
      green: "#6374a5", // Use for accents only
      cyan: "#00FFF7", // Alt accent (avoid using both at once)
    },
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#141b30",
      800: "#1F2937",
      900: "#111827",
      1000: "#1B2236",
    },
  },
  fonts: {
    heading: `'Segoe UI', ${base.fonts?.heading}`,
    body: `'Segoe UI', ${base.fonts?.body}`,
  },
  styles: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? "brand.900" : "white",
        color: props.colorMode === "dark" ? "gray.100" : "gray.900",
        fontFamily: "body",
      },
    }),
  },
  semanticTokens: {
    colors: {
      text: {
        default: "gray.800",
        _dark: "gray.100",
      },
      textDark: {
        default: "gray.100",
        _dark: "gray.900",
      },
      surface: {
        default: "white",
        _dark: "brand.1000",
      },
      surfaceSidebar: {
        default: "brand.900",
        _dark: "brand.1000",
      },
      surfaceCardBg: {
        default: "brand.900",
        _dark: "gray.1000",
      },
      surface2: {
        default: "white",
        _dark: "gray.1000",
      },
      surfaceButton: {
        default: "brand.500",
        _dark: "gray.1000",
      },
      bg: {
        default: "white",
        _dark: "brand.900",
      },
      primary: {
        default: "brand.500",
        _dark: "brand.400",
      },
      accent: {
        default: "neon.green",
        _dark: "neon.cyan",
      },
      cardBg: {
        default: "gray.50",
        _dark: "brand.800",
      },
      border: {
        default: "gray.200",
        _dark: "gray.700",
      },
      cardShadow: {
        default: "md",
        _dark: "lg",
      },
      mutedText: {
        default: "gray.600",
        _dark: "gray.400",
      },
    },
  },
});

export default customTheme;
