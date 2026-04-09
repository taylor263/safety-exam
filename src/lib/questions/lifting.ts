// 吊装作业安全常识题库
// 总分：10选择题(5分) + 10判断题(3分) + 5填空题(6分) = 100分

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
  // ==================== 选择题 (10道) ====================
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
  {
    id: 'lift_choice_006',
    type: 'choice',
    category: '吊装作业',
    question: '吊装作业前应清除作业区域多大范围内的障碍物？',
    options: ['A. 3米', 'B. 5米', 'C. 10米', 'D. 15米'],
    answer: 'B',
    explanation: '吊装作业前应清除作业区域5米范围内的障碍物，确保通道畅通。'
  },
  {
    id: 'lift_choice_007',
    type: 'choice',
    category: '吊装作业',
    question: '吊装作业时，吊物距离地面最大高度一般不超过多少米？',
    options: ['A. 1米', 'B. 2米', 'C. 3米', 'D. 5米'],
    answer: 'C',
    explanation: '吊物距离地面最大高度一般不超过3米，便于观察和操作。'
  },
  {
    id: 'lift_choice_008',
    type: 'choice',
    category: '吊装作业',
    question: '吊装作业使用的吊钩上应设置什么装置？',
    options: ['A. 警报器', 'B. 防脱装置', 'C. 照明灯', 'D. 计数器'],
    answer: 'B',
    explanation: '吊钩上应设置防脱装置，防止吊物脱落造成事故。'
  },
  {
    id: 'lift_choice_009',
    type: 'choice',
    category: '吊装作业',
    question: '以下哪种物品可以用吊车直接吊运？',
    options: ['A. 人员', 'B. 埋在地下的物体', 'C. 形状规则的货物', 'D. 带电的电缆'],
    answer: 'C',
    explanation: '只有形状规则、捆绑牢固的货物才能吊运，严禁吊人、埋地物、带电物。'
  },
  {
    id: 'lift_choice_010',
    type: 'choice',
    category: '吊装作业',
    question: '吊装作业指挥信号中，起重机驾驶员应该以谁的指令为准？',
    options: ['A. 任意人员', 'B. 专职指挥人员', 'C. 围观人员', 'D. 领导口头指示'],
    answer: 'B',
    explanation: '起重机驾驶员应只听从专职指挥人员的指令，确保统一指挥。'
  },

  // ==================== 判断题 (10道) ====================
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
  {
    id: 'lift_judge_006',
    type: 'judge',
    category: '吊装作业',
    question: '吊装作业时，吊物下方可以短暂停留。',
    answer: '错误',
    explanation: '吊物下方严禁人员停留或通过，必须设置警戒区域。'
  },
  {
    id: 'lift_judge_007',
    type: 'judge',
    category: '吊装作业',
    question: '吊装作业前应检查钢丝绳是否有断丝、断股现象。',
    answer: '正确',
    explanation: '钢丝绳有断丝、断股现象必须更换，否则容易断裂造成事故。'
  },
  {
    id: 'lift_judge_008',
    type: 'judge',
    category: '吊装作业',
    question: '吊装作业时，可以用吊钩钩挂物体。',
    answer: '错误',
    explanation: '严禁用吊钩直接钩挂物体，必须使用专用吊具进行捆绑。'
  },
  {
    id: 'lift_judge_009',
    type: 'judge',
    category: '吊装作业',
    question: '吊装作业完成后，应将吊钩升至安全高度并停放在指定位置。',
    answer: '正确',
    explanation: '作业完成后应将吊钩升至安全高度，停放在规定位置，防止意外。'
  },
  {
    id: 'lift_judge_010',
    type: 'judge',
    category: '吊装作业',
    question: '雷雨天气可以进行小型吊装作业。',
    answer: '错误',
    explanation: '雷雨天气禁止一切吊装作业，防止雷击和吊物坠落。'
  },

  // ==================== 填空题 (5道) ====================
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
  },
  {
    id: 'lift_fill_004',
    type: 'fill',
    category: '吊装作业',
    question: '吊装作业应使用统一规定的指挥信号，由______人员指挥。',
    answer: '专职',
    explanation: '吊装作业必须由专职指挥人员统一指挥，确保安全。'
  },
  {
    id: 'lift_fill_005',
    type: 'fill',
    category: '吊装作业',
    question: '钢丝绳的安全系数应大于______。',
    answer: '5',
    explanation: '钢丝绳的安全系数一般应大于5，确保吊装安全。'
  }
];

export default liftingQuestions;
