import { FormOption } from "@/types/GetStartForm";

const genderOptions: FormOption[] = [
  { id: "1", value: "男性" },
  { id: "2", value: "女性" },
];

const relationshipStatusOptions: FormOption[] = [
  { id: "1", value: "單身" },
  { id: "2", value: "交往中" },
  { id: "3", value: "已婚" },
  { id: "4", value: "剛分手" },
  { id: "5", value: "一言難盡" },
];

const matchGenderOptions: FormOption[] = [
  { id: "1", value: "男性" },
  { id: "2", value: "女性" },
  { id: "3", value: "都可以" },
];

const expectedRelationshipOptions: FormOption[] = [
  { id: "1", value: "閒聊" },
  { id: "2", value: "朋友" },
  { id: "3", value: "交往" },
  { id: "4", value: "結婚" },
  { id: "5", value: "長久關係" },
];

const interestOptions: FormOption[] = [
  { id: "1", value: "聊天" },
  { id: "2", value: "聽音樂" },
  { id: "3", value: "唱歌" },
  { id: "4", value: "踏青" },
  { id: "5", value: "逛街" },
  { id: "6", value: "玩遊戲" },
  { id: "7", value: "畫畫" },
  { id: "8", value: "看展覽" },
  { id: "9", value: "旅遊" },
  { id: "10", value: "健身" },
];
export {
  genderOptions,
  relationshipStatusOptions,
  matchGenderOptions,
  expectedRelationshipOptions,
  interestOptions,
};
