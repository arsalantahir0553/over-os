import { useEffect, useRef } from "react";
import { useColorMode } from "@chakra-ui/react";

export const useForceColorMode = (mode: "light" | "dark") => {
  const { colorMode, setColorMode } = useColorMode();
  const hasSetOnce = useRef(false);

  useEffect(() => {
    if (!hasSetOnce.current && colorMode !== mode) {
      setColorMode(mode);
      hasSetOnce.current = true;
    }
  }, [colorMode, mode, setColorMode]);
};
