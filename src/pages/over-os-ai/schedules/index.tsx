import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Icon,
  Flex,
  Spinner,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FiClock, FiCalendar, FiTrash2, FiEdit } from "react-icons/fi";
import { useGetMySchedules, useDeleteSchedule } from "@/utils/apis/django.api";
import { useState } from "react";
import { format } from "date-fns";
import type { UserSchedule } from "@/utils/types/types";

const MySchedules = () => {
  const { data: mySchedules, isLoading } = useGetMySchedules();
  const deleteSchedule = useDeleteSchedule();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSchedule, setSelectedSchedule] = useState<UserSchedule | null>(
    null
  );

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const handleDelete = (schedule: UserSchedule) => {
    setSelectedSchedule(schedule);
    onOpen();
  };

  const confirmDelete = () => {
    console.log("selectedSchedule", selectedSchedule);
    // if (selectedSchedule) {
    //   deleteSchedule.mutate(selectedSchedule.id, {
    //     onSuccess: () => {
    //       onClose();
    //       // Optionally refetch schedules
    //     },
    //   });
    // }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "inactive":
        return "orange";
      default:
        return "gray";
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return format(date, "h:mm a");
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!mySchedules || mySchedules.length === 0) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Text fontSize="lg" color={textColor}>
          No schedules found. Create your first schedule to get started.
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch" w="100%">
      {mySchedules.map((schedule: UserSchedule) => (
        <Box
          key={schedule.id}
          bg={cardBg}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          p={6}
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
          transition="all 0.2s"
        >
          <Flex justify="space-between" align="flex-start" mb={4}>
            <Box>
              <Text fontSize="xl" fontWeight="semibold" mb={1}>
                {schedule.prompt || "Untitled Schedule"}
              </Text>
              <Badge
                colorScheme={getStatusColor(schedule.status)}
                fontSize="0.7em"
                borderRadius="full"
                px={2}
                py={0.5}
              >
                {schedule.status}
              </Badge>
            </Box>
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Icon as={FiEdit} />}
                onClick={() => {
                  // Handle edit
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                leftIcon={<Icon as={FiTrash2} />}
                onClick={() => handleDelete(schedule)}
                // isLoading={deleteSchedule.isLoading}
              >
                Delete
              </Button>
            </HStack>
          </Flex>

          <VStack align="start" spacing={3} mt={4}>
            <HStack color={textColor}>
              <Icon as={FiClock} />
              <Text>
                {schedule.frequency.charAt(0).toUpperCase() +
                  schedule.frequency.slice(1)}{" "}
                at {formatTime(schedule.time_of_day)}
              </Text>
            </HStack>

            {schedule.day_of_week && (
              <HStack color={textColor}>
                <Icon as={FiCalendar} />
                <Text>
                  {schedule.frequency === "weekly" &&
                    `Every ${schedule.day_of_week}`}
                  {schedule.frequency === "monthly" &&
                    `Monthly on the ${schedule.day_of_week}`}
                </Text>
              </HStack>
            )}

            {schedule.end_date && (
              <HStack color={textColor}>
                <Icon as={FiCalendar} />
                <Text>
                  Ends on {format(new Date(schedule.end_date), "MMM d, yyyy")}
                </Text>
              </HStack>
            )}

            {schedule.description && (
              <Text color={textColor} fontSize="sm" mt={2}>
                {schedule.description}
              </Text>
            )}
          </VStack>
        </Box>
      ))}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Schedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Are you sure you want to delete this schedule?</Text>
            <Flex justify="flex-end" mt={6} gap={3}>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                // isLoading={deleteSchedule.isLoading}
              >
                Delete
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default MySchedules;
