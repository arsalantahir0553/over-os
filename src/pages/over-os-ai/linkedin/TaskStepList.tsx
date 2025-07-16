import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import { TaskStep } from "./TaskStep";

const TaskStepsList = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // First one open by default

  const steps = [
    {
      title: "Finding Top Trending News",
      description: "Search and identify trending AI/Tech news stories",
      status: "complete" as const,
      progress: 100,
    },
    {
      title: "Summarize News Story",
      description: "Create concise, engaging summary of the news",
      status: "complete" as const,
      progress: 100,
    },
    {
      title: "LinkedIn Post Draft",
      description:
        "Craft engaging LinkedIn post with hook, summary, and reflection",
      status: "in-progress" as const,
      progress: 85,
    },
    {
      title: "Post to LinkedIn",
      description: "Publish the final post on your LinkedIn profile",
      status: "pending" as const,
      progress: 0,
    },
  ];

  return (
    <VStack spacing={4} py={4} align="stretch">
      {steps.map((step, idx) => (
        <TaskStep
          key={idx}
          {...step}
          index={idx} // 👈 pass index
          isExpanded={expandedIndex === idx}
          onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
        />
      ))}
    </VStack>
  );
};

export default TaskStepsList;
