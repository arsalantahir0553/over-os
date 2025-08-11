import {
  calculateDurationFromDates,
  calculateEndDateFromDuration,
  convertLocalTimeToUTC,
  formatTimeToAMPM,
} from "@/utils/helpers/functions.helper";
import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuClock } from "react-icons/lu";
import {
  useUpdateSchedule,
  type UpdateSchedulePayload,
} from "@/utils/apis/django.api";

const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
const fullDayMap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullDayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export interface ScheduleData {
  frequency: "once" | "weekly" | "monthly";
  day_of_week: string;
  time_of_day: string;
  end_date?: string;
}

interface SchedulerProps {
  data?: ScheduleData[] | null;
  onScheduleChange?: (data: ScheduleData[]) => void;
  showUpdateButton?: boolean;
  id?: string;
  prompt?: string;
  refetchSessionData?: () => void;
}

const Scheduler = ({
  data,
  onScheduleChange,
  showUpdateButton,
  id,
  prompt = "",
  refetchSessionData,
}: SchedulerProps) => {
  const defaultSchedule = data && data.length > 0 ? data[0] : null;

  const [mode, setMode] = useState<"one-time" | "recurring">(
    defaultSchedule?.frequency === "weekly" ||
      defaultSchedule?.frequency === "monthly"
      ? "recurring"
      : "one-time"
  );
  const toast = useToast();

  const formatDayOfWeek = (day: string) => {
    const dayLower = day.toLowerCase();

    if (dayLower === "today" || dayLower === "tomorrow") {
      const date = new Date();
      if (dayLower === "tomorrow") {
        date.setDate(date.getDate() + 1);
      }
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
    }

    return day.slice(0, 3);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr.includes(" ")) return timeStr;
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>(() => {
    if (defaultSchedule?.time_of_day) {
      try {
        return formatTime(defaultSchedule.time_of_day);
      } catch {
        return "09:00";
      }
    }
    return "09:00";
  });

  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    if (data && data.length > 0) {
      return data.map((s) => formatDayOfWeek(s.day_of_week));
    }
    return [];
  });

  const [recurrence, setRecurrence] = useState<string>(
    defaultSchedule?.frequency === "monthly" ? "monthly" : "weekly"
  );

  const initialEndDate = (() => {
    if (defaultSchedule?.end_date) {
      return new Date(defaultSchedule.end_date);
    }
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  })();

  const [endDate, setEndDate] = useState<Date>(initialEndDate);

  const [duration, setDuration] = useState(() => {
    return calculateDurationFromDates(startDate, initialEndDate);
  });

  const prevValuesRef = useRef({
    mode,
    recurrence,
    selectedDays: selectedDays.join(","),
    time,
  });

  const toggleDay = (day: string) => {
    if (mode === "one-time") {
      setSelectedDays([day]);
    } else {
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    }
  };

  useEffect(() => {
    const newEndDate = calculateEndDateFromDuration(startDate, duration);
    setEndDate(newEndDate);
  }, [duration, startDate]);

  useEffect(() => {
    const newDuration = calculateDurationFromDates(startDate, endDate);
    setDuration(newDuration);
  }, [endDate, startDate]);

  const cardBg = useColorModeValue("white", "brand.900");

  useEffect(() => {
    const currentValues = {
      mode,
      recurrence,
      selectedDays: selectedDays.join(","),
      time,
    };

    const prevValues = prevValuesRef.current;

    if (
      currentValues.mode !== prevValues.mode ||
      currentValues.recurrence !== prevValues.recurrence ||
      currentValues.selectedDays !== prevValues.selectedDays ||
      currentValues.time !== prevValues.time
    ) {
      if (onScheduleChange) {
        const schedules: ScheduleData[] = selectedDays.map((day) => ({
          frequency:
            mode === "one-time" ? "once" : (recurrence as "weekly" | "monthly"),
          day_of_week: day,
          time_of_day: time,
          end_date: mode === "recurring" ? endDate.toISOString() : undefined,
        }));
        onScheduleChange(schedules);
      }

      prevValuesRef.current = currentValues;
    }
  }, [mode, recurrence, selectedDays, time, endDate, onScheduleChange]);

  const getOneTimeSchedulePreview = () => {
    const shortDays = selectedDays.map((d) => d.slice(0, 3)).join(", ");
    const formattedTime = formatTimeToAMPM(time);
    return `Post ${selectedDays.length} time (${shortDays}) at ${formattedTime}`;
  };

  const getRecurringSchedulePreview = () => {
    const shortDays = selectedDays.map((d) => d.slice(0, 3)).join(", ");
    const formattedTime = formatTimeToAMPM(time);
    return `Post ${
      selectedDays.length
    } times per week (${shortDays}) at ${formattedTime} for ${duration} (${startDate.toDateString()} - ${endDate.toDateString()})`;
  };

  const { mutate: updateSchedule, isPending } = useUpdateSchedule();

  const handleUpdateSchedule = () => {
    if (!id) return;

    // Get the index of the selected day to map to full day name
    const dayIndex = fullDayMap.findIndex((day) => day === selectedDays[0]);
    const fullDayName =
      dayIndex !== -1 ? fullDayNames[dayIndex] : selectedDays[0];

    // Format the end date to YYYY-MM-DD if it exists
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const payload: UpdateSchedulePayload = {
      prompt,
      frequency:
        mode === "one-time" ? "once" : (recurrence as "weekly" | "monthly"),
      day_of_week: fullDayName,
      time_of_day: convertLocalTimeToUTC(time),
      end_date: mode === "recurring" ? formatDate(endDate) : undefined,
    };

    console.log("payload", payload);

    updateSchedule(
      { id, data: payload },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Schedule updated successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update schedule.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
    refetchSessionData?.();
  };

  return (
    <Box
      width="100%"
      px={{ base: 3, md: 4, lg: 6 }}
      py={{ base: 3, md: 4 }}
      mt={2}
      bg={cardBg}
      border="1px solid"
      borderColor="border"
      borderRadius="xl"
    >
      <VStack spacing={6} align="stretch" width="100%">
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <Flex align="center" gap={2} flexShrink={0}>
            <LuClock size={18} />
            <Text
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              color="brand.500"
            >
              Schedule LinkedIn Publishing
            </Text>
          </Flex>
          <Button
            size={{ base: "xs", sm: "sm" }}
            bg="blue.600"
            color="white"
            _hover={{ bg: "blue.500" }}
            flexShrink={0}
            cursor="default"
          >
            {showUpdateButton ? "Scheduled" : "Schedule"}
          </Button>
        </Flex>

        <Tabs
          index={mode === "one-time" ? 0 : 1}
          onChange={(i) => setMode(i === 0 ? "one-time" : "recurring")}
          colorScheme="blue"
          variant="line"
        >
          <TabList overflowX="auto" py={1}>
            <Tab fontSize={{ base: "sm", md: "md" }} whiteSpace="nowrap">
              One Time
            </Tab>
            <Tab fontSize={{ base: "sm", md: "md" }} whiteSpace="nowrap">
              Recurring
            </Tab>
          </TabList>

          <TabPanels>
            {/* ---------------- ONE-TIME ---------------- */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                <Flex
                  flexDirection={{ base: "column", md: "row" }}
                  gap={{ base: 3, md: 4 }}
                  flexWrap="wrap"
                >
                  <Box
                    flex={{ base: "1 1 100%", lg: "1" }}
                    minW={{ base: "100%", lg: "auto" }}
                  >
                    <Text fontSize="sm" mb={1} color="mutedText">
                      Days
                    </Text>
                    <SimpleGrid
                      columns={{ base: 7, lg: 12 }}
                      spacing={{ base: 1, md: 2 }}
                      w="100%"
                      maxW="100%"
                      overflowX="auto"
                      pb={2}
                      css={{
                        "&::-webkit-scrollbar": {
                          height: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                          borderRadius: "4px",
                        },
                      }}
                    >
                      {fullDayMap.map((day, idx) => (
                        <Button
                          key={idx}
                          size="xs"
                          variant={
                            selectedDays.includes(day) ? "solid" : "outline"
                          }
                          colorScheme={
                            selectedDays.includes(day) ? "blue" : "gray"
                          }
                          onClick={() => toggleDay(day)}
                          w={{ base: "28px", sm: "32px", md: "40px" }}
                          h={{ base: "28px", sm: "32px", md: "40px" }}
                          minW={{ base: "28px", sm: "32px", md: "40px" }}
                          p={0}
                          flexShrink={0}
                          fontSize={{ base: "xs", sm: "sm" }}
                        >
                          {daysOfWeek[idx]}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Box
                    flex={{ base: "1 1 100%", sm: "1" }}
                    minW={{ base: "100%", sm: "auto" }}
                  >
                    <Text fontSize="sm" mb={1} color="mutedText">
                      Time
                    </Text>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      fontSize="sm"
                      bg="surface"
                      borderColor="border"
                    />
                  </Box>
                </Flex>

                <Box
                  bg="textDark"
                  px={{ base: 3, md: 4 }}
                  py={3}
                  rounded="md"
                  overflowX="auto"
                  width="100%"
                  maxWidth="100%"
                  sx={{
                    "&::-webkit-scrollbar": {
                      height: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "4px",
                    },
                  }}
                >
                  <Text
                    color="blue.300"
                    fontSize={{ base: "xs", sm: "sm" }}
                    fontWeight="semibold"
                    whiteSpace="nowrap"
                  >
                    Schedule Preview:
                  </Text>
                  <Text fontSize={{ base: "xs", sm: "sm" }} color="text" mt={1}>
                    {getOneTimeSchedulePreview()}
                  </Text>
                </Box>
              </VStack>
            </TabPanel>

            {/* ---------------- RECURRING ---------------- */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                <Flex
                  gap={{ base: 3, md: 4 }}
                  flexWrap="wrap"
                  alignItems="flex-start"
                >
                  <Box
                    flex={{ base: "1 1 100%", sm: "1" }}
                    minW={{ base: "100%", sm: "200px" }}
                    maxW="100%"
                  >
                    <Text fontSize="sm" mb={1} color="mutedText">
                      Frequency
                    </Text>
                    <Select
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value)}
                      fontSize="sm"
                      bg="surface"
                      borderColor="border"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                  </Box>

                  <Flex direction={"column"} gap={{ base: 3, md: 4 }}></Flex>

                  <Box
                    flex={{ base: "1 1 100%", lg: "1" }}
                    minW={{ base: "100%", lg: "auto" }}
                  >
                    <Text fontSize="sm" mb={1} color="mutedText">
                      Days
                    </Text>
                    <SimpleGrid
                      columns={7}
                      spacing={{ base: 1, md: 2 }}
                      w="100%"
                      maxW="100%"
                      overflowX="auto"
                      pb={2}
                      css={{
                        "&::-webkit-scrollbar": {
                          height: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                          borderRadius: "4px",
                        },
                      }}
                    >
                      {fullDayMap.map((day, idx) => (
                        <Button
                          key={idx}
                          size="xs"
                          variant={
                            selectedDays.includes(day) ? "solid" : "outline"
                          }
                          colorScheme={
                            selectedDays.includes(day) ? "blue" : "gray"
                          }
                          onClick={() => toggleDay(day)}
                          w={{ base: "28px", sm: "32px", md: "40px" }}
                          h={{ base: "28px", sm: "32px", md: "40px" }}
                          minW={{ base: "28px", sm: "32px", md: "40px" }}
                          p={0}
                          flexShrink={0}
                          fontSize={{ base: "xs", sm: "sm" }}
                        >
                          {daysOfWeek[idx]}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Box
                    flex={{ base: "1 1 100%", sm: "1" }}
                    minW={{ base: "100%", sm: "auto" }}
                  >
                    <Text fontSize="sm" mb={1} color="mutedText">
                      Time
                    </Text>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      fontSize="sm"
                      bg="surface"
                      borderColor="border"
                    />
                  </Box>
                </Flex>

                <Flex gap={{ base: 3, md: 4 }} flexWrap="wrap">
                  <Box
                    flex={{ base: "1 1 100%", sm: "1" }}
                    minW={{ base: "100%", sm: "auto" }}
                  >
                    <Text fontSize="sm" mb={1} color="mutedText">
                      Duration
                    </Text>
                    <Select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      fontSize="sm"
                      bg="surface"
                      borderColor="border"
                    >
                      <option>1 week</option>
                      <option>2 weeks</option>
                      <option>1 month</option>
                      <option>2 months</option>
                      <option>12 weeks</option>
                      <option>Until stopped</option>
                    </Select>
                  </Box>

                  <Box
                    flex={{ base: "1 1 100%", sm: "1" }}
                    minW={{ base: "100%", sm: "auto" }}
                  >
                    <Text fontSize="sm" mb={1} color="mutedText">
                      Start Date
                    </Text>
                    <Box
                      rounded="md"
                      bg="surface"
                      border="1px solid"
                      borderColor="border"
                      className="transparent-datepicker"
                      w="100%"
                    >
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => date && setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        calendarClassName="chakra-datepicker-dark"
                      />
                    </Box>
                  </Box>

                  <Box
                    flex={{ base: "1 1 100%", sm: "1" }}
                    minW={{ base: "100%", sm: "auto" }}
                  >
                    <Text fontSize="sm" mb={1} color="mutedText">
                      End Date
                    </Text>
                    <Box
                      rounded="md"
                      bg="surface"
                      border="1px solid"
                      borderColor="border"
                      className="transparent-datepicker"
                      w="100%"
                    >
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => date && setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        calendarClassName="chakra-datepicker-dark"
                      />
                    </Box>
                  </Box>
                </Flex>

                <Box
                  bg="brand.1000"
                  px={{ base: 3, md: 4 }}
                  py={3}
                  rounded="md"
                  overflowX="auto"
                  width="100%"
                  maxWidth="100%"
                  sx={{
                    "&::-webkit-scrollbar": {
                      height: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "4px",
                    },
                  }}
                >
                  <Text
                    color="blue.300"
                    fontSize={{ base: "xs", sm: "sm" }}
                    fontWeight="semibold"
                    whiteSpace="nowrap"
                  >
                    Schedule Preview:
                  </Text>
                  <Text
                    fontSize={{ base: "xs", sm: "sm" }}
                    color="gray.300"
                    mt={1}
                  >
                    {getRecurringSchedulePreview()}
                  </Text>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
          <Flex w="100%" justifyContent="flex-end">
            <Button
              onClick={handleUpdateSchedule}
              isLoading={isPending}
              isDisabled={!id}
              size={{ base: "xs", sm: "sm" }}
              flexShrink={0}
              maxW={{ base: "100%", md: "160px" }}
            >
              Update Schedule
            </Button>
          </Flex>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default Scheduler;
