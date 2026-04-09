// 动火作业、临时用电、高处作业安全常识题库
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

export const comprehensiveQuestions: Question[] = [
  // ==================== 动火作业 选择题 (4道) ====================
  {
    id: 'comp_hotwork_choice_001',
    type: 'choice',
    category: '动火作业',
    question: '在易燃易爆场所进行动火作业时，氧气的含量应控制在多少以下？',
    options: ['A. 21%', 'B. 23.5%', 'C. 25%', 'D. 30%'],
    answer: 'B',
    explanation: '氧含量低于23.5%时不易燃，防止富氧环境引发火灾。'
  },
  {
    id: 'comp_hotwork_choice_002',
    type: 'choice',
    category: '动火作业',
    question: '动火作业前必须办理什么证件？',
    options: ['A. 工作证', 'B. 动火作业许可证', 'C. 健康证', 'D. 上岗证'],
    answer: 'B',
    explanation: '动火作业前必须办理动火作业许可证，经审批后方可作业。'
  },
  {
    id: 'comp_hotwork_choice_003',
    type: 'choice',
    category: '动火作业',
    question: '动火作业点周围多少米范围内的易燃易爆物品必须清除？',
    options: ['A. 5米', 'B. 10米', 'C. 15米', 'D. 20米'],
    answer: 'B',
    explanation: '动火作业点周围10米范围内的易燃易爆物品必须清除或采取安全措施。'
  },
  {
    id: 'comp_hotwork_choice_004',
    type: 'choice',
    category: '动火作业',
    question: '动火作业完成后，需要观察多久确认无残留火种？',
    options: ['A. 10分钟', 'B. 30分钟', 'C. 1小时', 'D. 2小时'],
    answer: 'B',
    explanation: '动火作业完成后需观察至少30分钟，确认无残留火种后方可离开。'
  },

  // ==================== 临时用电作业 选择题 (3道) ====================
  {
    id: 'comp_electric_choice_001',
    type: 'choice',
    category: '临时用电作业',
    question: '临时用电设备应安装漏电保护器，漏电动作电流一般不大于多少毫安？',
    options: ['A. 10mA', 'B. 30mA', 'C. 50mA', 'D. 100mA'],
    answer: 'B',
    explanation: '一般干燥环境漏电动作电流不大于30mA，确保人员触电时快速断电。'
  },
  {
    id: 'comp_electric_choice_002',
    type: 'choice',
    category: '临时用电作业',
    question: '临时用电线路架设高度要求是多少？',
    options: ['A. 室内2米，室外3米', 'B. 室内3米，室外4米', 'C. 室内4米，室外5米', 'D. 没有要求'],
    answer: 'C',
    explanation: '临时用电线路架设高度室内不小于4米，室外不小于5米。'
  },
  {
    id: 'comp_electric_choice_003',
    type: 'choice',
    category: '临时用电作业',
    question: '临时用电设备在使用完毕后应该如何处理？',
    options: ['A. 随意放置', 'B. 及时拆除临时用电线路和设备', 'C. 继续通电', 'D. 交给下一人使用'],
    answer: 'B',
    explanation: '临时用电设备使用完毕后必须及时拆除，恢复原状。'
  },

  // ==================== 高处作业 选择题 (3道) ====================
  {
    id: 'comp_height_choice_001',
    type: 'choice',
    category: '高处作业',
    question: '高处作业是指在坠落高度基准面多少米以上的作业？',
    options: ['A. 1米', 'B. 2米', 'C. 3米', 'D. 5米'],
    answer: 'B',
    explanation: '根据规定，坠落高度基准面2米及2米以上的作业为高处作业。'
  },
  {
    id: 'comp_height_choice_002',
    type: 'choice',
    category: '高处作业',
    question: '高处作业人员应定期进行体检，以下哪类人员不适合高处作业？',
    options: ['A. 血压正常者', 'B. 患有高血压、心脏病的人员', 'C. 体重正常的', 'D. 无恐高症的'],
    answer: 'B',
    explanation: '患有高血压、心脏病、恐高症等人员不适合从事高处作业。'
  },
  {
    id: 'comp_height_choice_003',
    type: 'choice',
    category: '高处作业',
    question: '高处作业使用的脚手架，其宽度不得小于多少米？',
    options: ['A. 0.5米', 'B. 0.8米', 'C. 1米', 'D. 1.5米'],
    answer: 'B',
    explanation: '脚手架宽度不得小于0.8米，确保作业人员有足够的操作空间。'
  },

  // ==================== 动火作业 判断题 (4道) ====================
  {
    id: 'comp_hotwork_judge_001',
    type: 'judge',
    category: '动火作业',
    question: '在易燃易爆场所进行动火作业时，只需要办理动火证即可作业。',
    answer: '错误',
    explanation: '办理动火证只是基本要求，还需进行气体检测、清除周围易燃物、配备消防器材等安全措施。'
  },
  {
    id: 'comp_hotwork_judge_002',
    type: 'judge',
    category: '动火作业',
    question: '动火作业完成后应及时清理现场，但无需检查。',
    answer: '错误',
    explanation: '动火作业完成后必须清理现场、检查火种，确保无遗留安全隐患。'
  },
  {
    id: 'comp_hotwork_judge_003',
    type: 'judge',
    category: '动火作业',
    question: '动火作业时，可以不设置监护人。',
    answer: '错误',
    explanation: '动火作业必须设置监护人，监督作业过程，配备消防器材。'
  },
  {
    id: 'comp_hotwork_judge_004',
    type: 'judge',
    category: '动火作业',
    question: '在受限空间内进行动火作业时，应同时办理受限空间作业许可证。',
    answer: '正确',
    explanation: '受限空间内动火需同时办理两种许可证，确保双重安全。'
  },

  // ==================== 临时用电作业 判断题 (3道) ====================
  {
    id: 'comp_electric_judge_001',
    type: 'judge',
    category: '临时用电作业',
    question: '临时用电作业可以不用办理临时用电作业许可证。',
    answer: '错误',
    explanation: '临时用电作业必须办理临时用电作业许可证，经审批后方可作业。'
  },
  {
    id: 'comp_electric_judge_002',
    type: 'judge',
    category: '临时用电作业',
    question: '临时用电设备可以不用安装漏电保护器。',
    answer: '错误',
    explanation: '临时用电设备必须安装漏电保护器，实行一机一闸一漏电保护制度。'
  },
  {
    id: 'comp_electric_judge_003',
    type: 'judge',
    category: '临时用电作业',
    question: '临时用电设备使用完毕后应及时拆除线路和设备。',
    answer: '正确',
    explanation: '临时用电设备使用完毕后必须及时拆除，恢复原状，防止遗留安全隐患。'
  },

  // ==================== 高处作业 判断题 (3道) ====================
  {
    id: 'comp_height_judge_001',
    type: 'judge',
    category: '高处作业',
    question: '高处作业只要系好安全带就可以不系安全绳。',
    answer: '错误',
    explanation: '高处作业应同时使用安全带和安全绳，双重保险确保作业人员安全。'
  },
  {
    id: 'comp_height_judge_002',
    type: 'judge',
    category: '高处作业',
    question: '六级以上强风和大雨、大雪、大雾天气可以从事高处作业。',
    answer: '错误',
    explanation: '六级以上强风、大雨、大雪、大雾天气禁止高处作业，因视线受阻和作业条件恶劣。'
  },
  {
    id: 'comp_height_judge_003',
    type: 'judge',
    category: '高处作业',
    question: '高处作业时，工具可以随手放置。',
    answer: '错误',
    explanation: '高处作业时工具应放入工具袋或系牢，防止坠落伤人。'
  },

  // ==================== 动火作业 填空题 (2道) ====================
  {
    id: 'comp_hotwork_fill_001',
    type: 'fill',
    category: '动火作业',
    question: '动火作业前必须办理______，并清除周围易燃易爆物品，配备消防器材。',
    answer: '动火作业许可证',
    explanation: '动火作业许可证是动火作业的基本安全要求。'
  },
  {
    id: 'comp_hotwork_fill_002',
    type: 'fill',
    category: '动火作业',
    question: '动火作业点周围______米范围内的易燃易爆物品必须清除。',
    answer: '10',
    explanation: '动火作业点周围10米范围内必须清除易燃易爆物品。'
  },

  // ==================== 临时用电作业 填空题 (2道) ====================
  {
    id: 'comp_electric_fill_001',
    type: 'fill',
    category: '临时用电作业',
    question: '临时用电设备必须安装漏电保护器，实行一机一闸一______制度。',
    answer: '漏电保护',
    explanation: '一机一闸一漏电保护是临时用电的基本安全要求。'
  },
  {
    id: 'comp_electric_fill_002',
    type: 'fill',
    category: '临时用电作业',
    question: '临时用电线路架设高度室内不小于______米。',
    answer: '4',
    explanation: '室内临时用电线路架设高度不小于4米。'
  },

  // ==================== 高处作业 填空题 (1道) ====================
  {
    id: 'comp_height_fill_001',
    type: 'fill',
    category: '高处作业',
    question: '高处作业人员必须佩戴安全带、安全帽等个人防护装备，安全带应______挂在牢固构件上。',
    answer: '高挂低用',
    explanation: '高挂低用是安全带的标准挂法，可以减小坠落距离。'
  }
];

export default comprehensiveQuestions;
