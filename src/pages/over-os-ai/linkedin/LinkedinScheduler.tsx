import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
  // Textarea,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const LinkedinScheduler = () => {
  const [mode, setMode] = useState("one-time");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [recurrence, setRecurrence] = useState("weekly");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleDate = (date: Date) => {
    const exists = selectedDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    if (exists) {
      setSelectedDates((prev) =>
        prev.filter((d) => d.toDateString() !== date.toDateString())
      );
    } else {
      setSelectedDates((prev) => [...prev, date]);
    }
  };

  const cardBg = useColorModeValue("white", "gray.1000");
  const borderColor = useColorModeValue("gray.200", "border");

  return (
    <Box
      width="100%"
      px={[4, 6, 12]} // Responsive horizontal padding
      py={[4, 6]}
      mt={6}
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
    >
      <VStack spacing={6} align="stretch" width="100%">
        <Text fontSize="2xl" fontWeight="bold">
          Schedule Settings
        </Text>

        <Select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          bg="surface"
          borderColor="border"
        >
          <option value="one-time">One Time</option>
          <option value="recursive">Recursive</option>
        </Select>

        {mode === "one-time" && (
          <Flex direction={["column", "row"]} gap={4}>
            <Flex
              align="center"
              gap={3}
              bg="surface"
              px={1}
              pl={3}
              rounded="md"
              flex="1"
              cursor={"pointer"}
            >
              <Box
                className="transparent-datepicker"
                display="flex"
                alignItems="center"
                width="full"
              >
                <DatePicker
                  selected={startDate}
                  onChange={(date) => date && setStartDate(date)}
                  dateFormat="MMMM d, yyyy"
                  calendarClassName="chakra-datepicker-dark"
                  customInput={
                    <Flex align="center" gap={3} width="full">
                      <CalendarIcon width={18} />
                      <Box flex={1}>
                        {startDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Box>
                    </Flex>
                  }
                />
              </Box>
            </Flex>
            <Input
              type="time"
              placeholder="Select time"
              bg="surface"
              borderColor="border"
              flex="1"
            />
          </Flex>
        )}

        {mode === "recursive" && (
          <VStack align="stretch" spacing={4}>
            <Select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              bg="surface"
              borderColor="border"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>

            {recurrence === "weekly" && (
              <SimpleGrid columns={[2, 4, 7]} spacing={2}>
                {daysOfWeek.map((day) => (
                  <Button
                    key={day}
                    size="sm"
                    variant={selectedDays.includes(day) ? "solid" : "outline"}
                    colorScheme={selectedDays.includes(day) ? "blue" : "gray"}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </SimpleGrid>
            )}

            {recurrence === "monthly" && (
              <Box display="flex" flexDirection="column" gap={3}>
                <Button
                  leftIcon={<CalendarIcon width={18} />}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  bg="surface"
                  size="md"
                  color="text"
                  border="1px solid"
                  borderColor="border"
                  fontWeight={400}
                  _hover={{ bg: "surface" }}
                  justifyContent="flex-start"
                  width="100%"
                >
                  {isCalendarOpen ? "Hide Calendar" : "Select Dates"}
                </Button>

                {isCalendarOpen && (
                  <Box className="transparent-datepicker" mt={2}>
                    <DatePicker
                      onChange={(date) => date && toggleDate(date)}
                      highlightDates={selectedDates}
                      inline
                      calendarClassName="chakra-datepicker-dark"
                      dayClassName={(date) =>
                        selectedDates.some(
                          (d) => d.toDateString() === date.toDateString()
                        )
                          ? "selected-day"
                          : ""
                      }
                    />
                  </Box>
                )}
                <Flex gap={4} wrap="wrap" mt={4}>
                  <Box flex="1">
                    <Text fontSize="sm" mb={1} color="mutedText">
                      Start Date
                    </Text>
                    <Box
                      rounded="md"
                      bg="surface"
                      border="1px solid"
                      borderColor="border"
                      className="transparent-datepicker"
                      w="full"
                      position="relative"
                    >
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => date && setStartDate(date)}
                        dateFormat="MMMM d, yyyy"
                        calendarClassName="chakra-datepicker-dark"
                        wrapperClassName="w-full"
                      />
                    </Box>
                  </Box>

                  <Box flex="1">
                    <Text fontSize="sm" mb={1} color="mutedText">
                      End Date
                    </Text>
                    <Box
                      rounded="md"
                      bg="surface"
                      border="1px solid"
                      borderColor="border"
                      className="transparent-datepicker"
                      w="full"
                      position="relative"
                    >
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => date && setEndDate(date)}
                        dateFormat="MMMM d, yyyy"
                        calendarClassName="chakra-datepicker-dark"
                        wrapperClassName="w-full"
                      />
                    </Box>
                  </Box>
                </Flex>

                <Box mt={2}>
                  <Text fontSize="sm" color="mutedText">
                    Selected Dates:
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {selectedDates.map((date, idx) => (
                      <Box
                        key={idx}
                        px={4}
                        py={2}
                        bg="border"
                        borderRadius="md"
                        fontSize="sm"
                      >
                        {date.toDateString()}
                      </Box>
                    ))}
                  </Flex>
                </Box>
              </Box>
            )}
          </VStack>
        )}

        <Flex justify="flex-end">
          <Button
            mt={4}
            bg="primary"
            color="white"
            _hover={{ bg: "brand.400" }}
          >
            Save Schedule
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default LinkedinScheduler;
