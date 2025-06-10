import { HStack, Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function ChatLoadingDots() {
  return (
    <HStack
      spacing={1}
      height="2rem"
      px={3}
      py={2}
      alignItems="center"
      justifyContent="center"
      borderRadius="20px"
      bg="gray.100"
    >
      {[0, 1, 2].map((i) => (
        <MotionBox
          key={i}
          w="8px"
          h="8px"
          bg="gray.500"
          borderRadius="full"
          animate={{
            y: [0, -4, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </HStack>
  );
}
