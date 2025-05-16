import { useUserInput } from "@/context/useChatContext";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaBrain, FaCogs, FaRobot, FaSearch, FaSpinner } from "react-icons/fa";

const icons = [FaRobot, FaSearch, FaSpinner, FaBrain, FaCogs];
const ICON_SIZE = 60;
const GAP = 40;
const STEP = ICON_SIZE + GAP;

const ChatLoading = () => {
  const { userInput } = useUserInput();
  const bg = useColorModeValue("white", "gray.700");

  const x = useMotionValue(0);
  const iconRef = useRef([icons[icons.length - 1], ...icons.slice(0, 3)]);

  const [tick, setTick] = useState(0); // trigger re-render

  useEffect(() => {
    const interval = setInterval(() => {
      animate(x, -STEP, {
        duration: 0.1,
        ease: "linear",
        onComplete: () => {
          const updated = iconRef.current;
          const first = updated.shift();
          if (first) updated.push(first);
          iconRef.current = updated;

          x.set(0);
          setTick((prev) => prev + 1); // trigger rerender
        },
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box w="100%" textAlign="center" py={6}>
      <Box
        bg={bg}
        maxW="600px"
        mx="auto"
        px={6}
        py={4}
        borderRadius="md"
        boxShadow="md"
        mb={8}
        fontSize="17px"
        color="gray.800"
        fontFamily={"Inter"}
      >
        {userInput || "Waiting for your input..."}
      </Box>

      <Text fontFamily={"Inter"} mb={6} fontWeight={400} color={"gray.500"}>
        Searching for the best LLM for your goal
      </Text>

      <Box
        maxW="240px"
        mx="auto"
        overflow="hidden"
        height="60px"
        position="relative"
      >
        <motion.div
          style={{
            display: "flex",
            gap: `${GAP}px`,
            x,
          }}
        >
          {iconRef.current.map((IconComp, idx) => (
            <Box
              key={tick + "-" + idx}
              fontSize="36px"
              color="gray.400"
              minW={`${ICON_SIZE}px`}
              textAlign="center"
            >
              <IconComp />
            </Box>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
};

export default ChatLoading;
