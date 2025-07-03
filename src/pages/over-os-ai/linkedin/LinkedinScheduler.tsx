import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
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
      p={6}
      borderRadius="xl"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      maxW="600px"
      //   mx="auto"
      mt={2}
    >
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Schedule Settings
        </Text>

        <Select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          bg="surface"
          borderColor="border"
        >
          <option value="one-time">One Time</option>
          <option value="query">Query Based</option>
          <option value="recursive">Recursive</option>
        </Select>

        {mode === "one-time" && (
          <Flex direction="column" gap={4}>
            <Flex
              align="center"
              gap={3}
              bg="surface"
              px={1}
              pl={3}
              rounded={"4px"}
            >
              <CalendarIcon width={18} />
              <Box className="transparent-datepicker">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => date && setStartDate(date)}
                  dateFormat="MMMM d, yyyy"
                  calendarClassName="chakra-datepicker-dark"
                />
              </Box>
            </Flex>
            <Input
              type="time"
              placeholder="Select time"
              bg="surface"
              borderColor="border"
            />
          </Flex>
        )}

        {mode === "query" && (
          <Textarea
            placeholder="Enter scheduling prompt..."
            bg="surface"
            borderColor="border"
            borderWidth="1px"
            borderRadius="md"
            _focus={{ borderColor: "primary", boxShadow: "none" }}
          />
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
              <SimpleGrid columns={7} spacing={2}>
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
              <Box
                display={"flex"}
                alignContent={"start"}
                flexDirection={"column"}
                gap={2}
              >
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
                  width="100%" // Optional, only if you want full-width alignment
                >
                  {isCalendarOpen ? "Hide Calendar" : "Select Dates"}
                </Button>

                {isCalendarOpen && (
                  <>
                    <Flex
                      align="center"
                      gap={3}
                      //   bg="surface"
                      justifyContent={"start"}
                      w={"full"}
                      px={1}
                      //   pl={3}
                      rounded={"4px"}
                      mt={3}
                    >
                      <Box className="transparent-datepicker">
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
                    </Flex>
                  </>
                )}

                <Flex gap={4} mt={4} wrap="wrap">
                  {/* Start Date */}
                  <Box flex="1">
                    <Text fontSize="sm" mb={1} color="mutedText">
                      Start Date
                    </Text>
                    <Box
                      //   px={3}
                      //   py={2}
                      rounded="md"
                      bg="surface"
                      border="1px solid"
                      borderColor="border"
                      className="transparent-datepicker"
                      w={"full"}
                    >
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => date && setStartDate(date)}
                        dateFormat="MMMM d, yyyy"
                        calendarClassName="chakra-datepicker-dark"
                      />
                    </Box>
                  </Box>

                  {/* End Date */}
                  <Box flex="1">
                    <Text fontSize="sm" mb={1} color="mutedText">
                      End Date
                    </Text>
                    <Box
                      //   px={3}
                      //   py={2}
                      w={"full"}
                      rounded="md"
                      bg="surface"
                      border="1px solid"
                      borderColor="border"
                      className="transparent-datepicker"
                    >
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => date && setEndDate(date)}
                        dateFormat="MMMM d, yyyy"
                        calendarClassName="chakra-datepicker-dark"
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

        <Button bg="primary" color="white" _hover={{ bg: "brand.400" }}>
          Save Schedule
        </Button>
      </VStack>
    </Box>
  );
};

export default LinkedinScheduler;
