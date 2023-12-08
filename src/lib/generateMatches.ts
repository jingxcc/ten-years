import { UpdateGetStartFormData } from "@/types/GetStartForm";

const shufflePotentialUsers = (allPotentialUsers: UpdateGetStartFormData[]) => {
  const shuffledList = allPotentialUsers.sort(() => 0.5 - Math.random());
  const selectedMatches = shuffledList.slice(0, 3);

  return selectedMatches;
};

export { shufflePotentialUsers };
