// LoadingOverlay.tsx
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionText = motion(Text);

export const LoadingOverlay = ({ message }: { message: string }) => {
  return (
    <Center backdropFilter="blur(8px)">
      <VStack spacing={4} textAlign="center">
        <Spinner size="xl" thickness="4px" color="accent" />
        <MotionText
          fontSize={["md", "lg", "xl"]}
          fontWeight="bold"
          color="white"
          textAlign="center"
          px={4}
          textShadow="0 0 6px rgba(0,0,0,0.3)"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </MotionText>
      </VStack>
    </Center>
  );
};
