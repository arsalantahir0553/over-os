import CustomModal from "@/components/modals/CustomModal";
import { useDeleteSchedule, useGetMySchedules } from "@/utils/apis/django.api";
import type { UserSchedule } from "@/utils/types/types";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiCalendar, FiChevronLeft, FiClock, FiTrash2 } from "react-icons/fi";

const MySchedules = () => {
  const navigate = useNavigate();
  const { data: mySchedules, isLoading, refetch } = useGetMySchedules();
  const { mutate: deleteSchedule } = useDeleteSchedule();
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
    if (selectedSchedule) {
      deleteSchedule(selectedSchedule.id.toString(), {
        onSuccess: () => {
          onClose();
          refetch();
        },
      });
    }
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
    <>
      <HStack
        align="center "
        cursor="pointer"
        onClick={() => navigate(-1)}
        bg={"surface2"}
        maxW={"80px"}
        rounded={"8px"}
        mb={8}
      >
        <IconButton
          aria-label="Go back"
          icon={<FiChevronLeft />}
          bg="transparent"
          _hover={{ bg: "transparent" }}
          p={0}
        />
        <Text ml={-3} fontSize="sm" fontWeight="semibold">
          Back
        </Text>
      </HStack>
      <VStack spacing={6} align="stretch" w="100%" mt={4}>
        <Text fontSize="xl" fontWeight="semibold" mb={1}>
          My Schedules
        </Text>
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

        <CustomModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={confirmDelete}
          onCancel={onClose}
          header="Delete Schedule"
          submitText="Delete"
          cancelText="Cancel"
          submitButtonColor="red"
        >
          <Text>Are you sure you want to delete this schedule?</Text>
        </CustomModal>
      </VStack>
    </>
  );
};

export default MySchedules;
