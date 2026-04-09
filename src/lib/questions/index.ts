// 题库导出

export { default as confinedSpaceQuestions } from './confined-space';
export { default as liftingQuestions } from './lifting';
export { default as comprehensiveQuestions } from './comprehensive';

import confinedSpaceQuestions from './confined-space';
import liftingQuestions from './lifting';
import comprehensiveQuestions from './comprehensive';

export interface Question {
  id: string;
  type: 'choice' | 'judge' | 'fill';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  category: string;
}

// 工种对应的答题模块
export type WorkType = 'confined_space' | 'lifting' | 'comprehensive';

export interface WorkTypeConfig {
  id: WorkType;
  name: string;
  description: string;
  questionCount: {
    choice: number;
    judge: number;
    fill: number;
  };
}

export const workTypes: WorkTypeConfig[] = [
  {
    id: 'confined_space',
    name: '受限空间作业',
    description: '储罐、容器、管道、地下室等密闭空间作业',
    questionCount: { choice: 5, judge: 5, fill: 3 },
  },
  {
    id: 'lifting',
    name: '吊装作业',
    description: '使用起重机械吊运物体的作业',
    questionCount: { choice: 5, judge: 5, fill: 3 },
  },
  {
    id: 'comprehensive',
    name: '动火/临时用电/高处作业',
    description: '动火作业、临时用电作业、高处作业综合考核',
    questionCount: { choice: 10, judge: 7, fill: 3 },
  },
];

// 获取对应工种的题目
export function getQuestionsByWorkType(workType: WorkType): Question[] {
  switch (workType) {
    case 'confined_space':
      return confinedSpaceQuestions;
    case 'lifting':
      return liftingQuestions;
    case 'comprehensive':
      return comprehensiveQuestions;
    default:
      return [];
  }
}

// 打乱顺序
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
