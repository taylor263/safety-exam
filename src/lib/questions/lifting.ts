// 吊装作业安全常识题库

export interface Question {
  id: string;
  type: 'choice' | 'judge' | 'fill';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  category: string;
}

export const liftingQuestions: Question[] = [
  // ==================== 选择题 (5道) ====================
  {
    id: 'lift_choice_001',
    type: 'choice',
    category: '吊装作业',
    question: '吊装作业时，吊物下方多远范围内禁止有人停留或通过？',
    options: ['A. 3米', 'B. 5米', 'C. 10米', 'D. 15米'],
    answer: 'C',
    explanation: '吊装作业时，吊物下方10米范围内为危险区域，禁止人员停留或通过。'
  },
  {
    id: 'lift_choice_002',
    type: 'choice',
    category: '吊装作业',
    question: '吊装作业前必须检查起重机的哪些安全装置？',
    options: ['A. 音响设备', 'B. 制动器、限位装置', 'C. 空调设备', 'D. 娱乐设施'],
    answer: 'B',
    explanation: '必须检查制动器、限位装置等安全装置是否灵敏可靠。'
  },
  {
    id: 'lift_choice_003',
    type: 'choice',
    category: '吊装作业',
    question: '以下哪种情况下禁止进行吊装作业？',
    options: ['A. 晴天', 'B. 六级以上强风天气', 'C. 白天', 'D. 工作日'],
    answer: 'B',
    explanation: '六级以上强风天气禁止吊装作业，防止吊物坠落造成事故。'
  },
  {
    id: 'lift_choice_004',
    type: 'choice',
    category: '吊装作业',
    question: '吊装作业指挥人员应使用什么信号？',
    options: ['A. 手势信号', 'B. 对讲机指令', 'C. 哨声和手势配合的专用信号', 'D. 随意指挥'],
    answer: 'C',
    explanation: '应使用哨声和手势配合的专用信号进行统一指挥。'
  },
  {
    id: 'lift_choice_005',
    type: 'choice',
    category: '吊装作业',
    question: '钢丝绳的安全系数一般应大于多少？',
    options: ['A. 3', 'B. 5', 'C. 7', 'D. 10'],
    answer: 'B',
    explanation: '钢丝绳的安全系数一般应大于5，确保吊装安全。'
  },

  // ==================== 判断题 (5道) ====================
  {
    id: 'lift_judge_001',
    type: 'judge',
    category: '吊装作业',
    question: '吊装作业时，可以用吊车吊人。',
    answer: '错误',
    explanation: '严禁用吊车吊运人员，吊人极易造成人员坠落事故。'
  },
  {
    id: 'lift_judge_002',
    type: 'judge',
    category: '吊装作业',
    question: '吊装作业时可以斜拉歪拽吊物。',
    answer: '错误',
    explanation: '禁止斜拉歪拽吊物，容易造成超载和吊物摆动引发事故。'
  },
  {
    id: 'lift_judge_003',
    type: 'judge',
    category: '吊装作业',
    question: '吊装作业前不需要对作业区域进行清理。',
    answer: '错误',
    explanation: '吊装作业前必须清理作业区域，确保通道畅通，无障碍物。'
  },
  {
    id: 'lift_judge_004',
    type: 'judge',
    category: '吊装作业',
    question: '吊装作业时，指挥人员可以离开现场。',
    answer: '错误',
    explanation: '指挥人员必须全程在场，统一指挥，确保作业安全。'
  },
  {
    id: 'lift_judge_005',
    type: 'judge',
    category: '吊装作业',
    question: '被吊物上有人时可以进行吊装作业。',
    answer: '错误',
    explanation: '被吊物上严禁站人，必须确认无人后方可起吊。'
  },

  // ==================== 填空题 (3道) ====================
  {
    id: 'lift_fill_001',
    type: 'fill',
    category: '吊装作业',
    question: '吊装作业前必须检查起重机的______、制动器、限位装置等安全装置是否灵敏可靠。',
    answer: '吊具',
    explanation: '吊具是吊装作业的核心设备，必须确保安全可靠。'
  },
  {
    id: 'lift_fill_002',
    type: 'fill',
    category: '吊装作业',
    question: '吊装作业时，吊物下方______米范围内禁止人员停留或通过。',
    answer: '10',
    explanation: '10米范围内为危险区域，必须设置警戒线并派人监护。'
  },
  {
    id: 'lift_fill_003',
    type: 'fill',
    category: '吊装作业',
    question: '六级以上______天气禁止进行吊装作业。',
    answer: '强风',
    explanation: '强风天气吊物易失控坠落，必须停止作业。'
  }
];

export default liftingQuestions;
