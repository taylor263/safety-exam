// 受限空间作业安全常识题库

export interface Question {
  id: string;
  type: 'choice' | 'judge' | 'fill';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  category: string;
}

export const confinedSpaceQuestions: Question[] = [
  // ==================== 选择题 (5道) ====================
  {
    id: 'cs_choice_001',
    type: 'choice',
    category: '受限空间作业',
    question: '进入受限空间作业前必须进行哪三项检测？',
    options: ['A. 温度、湿度、噪音', 'B. 可燃气体、有毒气体和氧含量', 'C. 压力、风速、粉尘', 'D. 电压、电流、功率'],
    answer: 'B',
    explanation: '受限空间作业前必须检测可燃气体、有毒气体和氧含量，确保作业环境安全。'
  },
  {
    id: 'cs_choice_002',
    type: 'choice',
    category: '受限空间作业',
    question: '进入受限空间作业时，氧含量应保持在多少？',
    options: ['A. 10.5%~12.5%', 'B. 18%~21%', 'C. 23.5%以上', 'D. 25%~30%'],
    answer: 'C',
    explanation: '氧含量应保持在23.5%以上，防止缺氧或富氧环境带来的安全隐患。'
  },
  {
    id: 'cs_choice_003',
    type: 'choice',
    category: '受限空间作业',
    question: '受限空间作业时，监护人应多久与作业人员联系一次？',
    options: ['A. 5分钟', 'B. 10分钟', 'C. 15分钟', 'D. 30分钟'],
    answer: 'B',
    explanation: '监护人应至少每隔10分钟与作业人员联系一次，确保人员安全。'
  },
  {
    id: 'cs_choice_004',
    type: 'choice',
    category: '受限空间作业',
    question: '受限空间作业许可证的有效期最长为多少小时？',
    options: ['A. 4小时', 'B. 8小时', 'C. 12小时', 'D. 24小时'],
    answer: 'D',
    explanation: '受限空间作业许可证有效期最长不超过24小时，超过需重新审批。'
  },
  {
    id: 'cs_choice_005',
    type: 'choice',
    category: '受限空间作业',
    question: '以下哪种情况不需要进入受限空间作业许可证？',
    options: ['A. 容器内焊接作业', 'B. 日常设备巡检', 'C. 储罐清理作业', 'D. 地下井检查'],
    answer: 'B',
    explanation: '日常设备巡检如不涉及特殊作业，可不办理许可证，但需做好安全确认。'
  },

  // ==================== 判断题 (5道) ====================
  {
    id: 'cs_judge_001',
    type: 'judge',
    category: '受限空间作业',
    question: '受限空间作业时，为了方便沟通，作业人员可以将便携式气体检测仪放在一旁。',
    answer: '错误',
    explanation: '便携式气体检测仪应随身携带，实时监测作业环境中的气体浓度变化。'
  },
  {
    id: 'cs_judge_002',
    type: 'judge',
    category: '受限空间作业',
    question: '进入受限空间作业时，监护人因临时有事可以短时间离开。',
    answer: '错误',
    explanation: '监护人不得擅自离开作业现场，应全程监护并保持与作业人员的联系。'
  },
  {
    id: 'cs_judge_003',
    type: 'judge',
    category: '受限空间作业',
    question: '受限空间作业完成后，作业人员可以直接离开。',
    answer: '错误',
    explanation: '作业完成后应清点人数，确认所有人员已撤离，恢复现场设施。'
  },
  {
    id: 'cs_judge_004',
    type: 'judge',
    category: '受限空间作业',
    question: '在受限空间内作业时，可以使用明火照明。',
    answer: '错误',
    explanation: '受限空间内禁止使用明火，如需照明应使用安全电压的防爆灯具。'
  },
  {
    id: 'cs_judge_005',
    type: 'judge',
    category: '受限空间作业',
    question: '受限空间作业前必须对作业设备进行可靠切断。',
    answer: '正确',
    explanation: '作业前必须对相关设备进行断电、断气、断料等可靠切断，防止意外启动。'
  },

  // ==================== 填空题 (3道) ====================
  {
    id: 'cs_fill_001',
    type: 'fill',
    category: '受限空间作业',
    question: '进入受限空间作业必须进行氧含量、可燃气体和______检测合格后方可作业。',
    answer: '有毒气体',
    explanation: '有毒气体检测是确保受限空间作业安全的重要环节。'
  },
  {
    id: 'cs_fill_002',
    type: 'fill',
    category: '受限空间作业',
    question: '受限空间作业应设置专职______，负责监护作业人员的安全。',
    answer: '监护人',
    explanation: '监护人负责监督作业过程，确保安全措施落实到位。'
  },
  {
    id: 'cs_fill_003',
    type: 'fill',
    category: '受限空间作业',
    question: '受限空间作业许可证的有效期最长不超过______小时。',
    answer: '24',
    explanation: '许可证有效期最长24小时，超时需重新审批。'
  }
];

export default confinedSpaceQuestions;
