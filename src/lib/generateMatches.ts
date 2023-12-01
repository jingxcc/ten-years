import { MatchUser } from "@/types/MatchPage";

const shufflePotentialUsers = (allPotentialUsers: MatchUser[]) => {
  const shuffledList = allPotentialUsers.sort(() => 0.5 - Math.random());
  const selectedMatches = shuffledList.slice(0, 3);

  return selectedMatches;
};

export { shufflePotentialUsers };
