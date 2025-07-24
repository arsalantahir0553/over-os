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
} from "@chakra-ui/react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuClock } from "react-icons/lu";

const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
const fullDayMap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Scheduler = () => {
  const [mode, setMode] = useState<"one-time" | "recurring">("one-time");
  const [startDate, setStartDate] = useState(new Date("2024-12-30"));
  const [endDate, setEndDate] = useState(new Date("2025-02-24"));
  const [time, setTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon",
    "Wed",
    "Fri",
  ]);
  const [recurrence, setRecurrence] = useState("weekly");
  const [duration, setDuration] = useState("8 weeks");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const cardBg = useColorModeValue("white", "brand.900");

  const getSchedulePreview = () => {
    const shortDays = selectedDays.map((d) => d.slice(0, 3)).join(", ");
    return `Post ${
      selectedDays.length
    } times per week (${shortDays}) at ${time} AM EST for ${duration} (${startDate.toDateString()} - ${endDate.toDateString()})`;
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
          >
            Scheduled
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
                    flex={{ base: "1 1 100%", sm: "1" }}
                    minW={{ base: "100%", sm: "auto" }}
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
                    {getSchedulePreview()}
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
                    {getSchedulePreview()}
                  </Text>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default Scheduler;
