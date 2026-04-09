// 受限空间作业安全常识题库
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

export const confinedSpaceQuestions: Question[] = [
  // ==================== 选择题 (10道) ====================
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
  {
    id: 'cs_choice_006',
    type: 'choice',
    category: '受限空间作业',
    question: '受限空间作业前必须对作业设备进行什么处理？',
    options: ['A. 润滑保养', 'B. 可靠切断', 'C. 外观清洁', 'D. 性能测试'],
    answer: 'B',
    explanation: '作业前必须对相关设备进行断电、断气、断料等可靠切断，防止意外启动。'
  },
  {
    id: 'cs_choice_007',
    type: 'choice',
    category: '受限空间作业',
    question: '在受限空间内作业时，可以采用什么方式照明？',
    options: ['A. 普通白炽灯', 'B. 安全电压的防爆灯具', 'C. 蜡烛或酒精灯', 'D. 手机手电筒'],
    answer: 'B',
    explanation: '受限空间内应使用安全电压的防爆灯具，禁止使用明火照明。'
  },
  {
    id: 'cs_choice_008',
    type: 'choice',
    category: '受限空间作业',
    question: '受限空间作业时，发现有人中毒应该首先怎么做？',
    options: ['A. 立即进入救援', 'B. 拨打120并报告', 'C. 佩戴防毒面具后进入救援', 'D. 用风扇通风'],
    answer: 'B',
    explanation: '发现中毒应首先拨打120并报告，切勿盲目进入救援，防止连环中毒。'
  },
  {
    id: 'cs_choice_009',
    type: 'choice',
    category: '受限空间作业',
    question: '受限空间作业完成后，应首先做什么？',
    options: ['A. 清理工具', 'B. 关闭出入口', 'C. 清点人数，确认所有人员已撤离', 'D. 恢复设备运行'],
    answer: 'C',
    explanation: '作业完成后应首先清点人数，确认所有人员已撤离，确保安全。'
  },
  {
    id: 'cs_choice_010',
    type: 'choice',
    category: '受限空间作业',
    question: '受限空间作业的气体检测顺序应该是？',
    options: ['A. 先检测上部，再检测中部，最后检测下部', 'B. 先检测下部，再检测中部，最后检测上部', 'C. 随意检测', 'D. 只检测中部'],
    answer: 'B',
    explanation: '气体检测应先检测下部（比重较重的气体），再检测中部，最后检测上部。'
  },

  // ==================== 判断题 (10道) ====================
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
  {
    id: 'cs_judge_006',
    type: 'judge',
    category: '受限空间作业',
    question: '在有有害气体的受限空间作业时，作业人员可以不佩戴防护用品。',
    answer: '错误',
    explanation: '在有有害气体的受限空间作业时，必须佩戴相应的防护用品。'
  },
  {
    id: 'cs_judge_007',
    type: 'judge',
    category: '受限空间作业',
    question: '受限空间作业时，可以采取强制通风措施。',
    answer: '正确',
    explanation: '受限空间作业时应采取强制通风措施，确保空气流通。'
  },
  {
    id: 'cs_judge_008',
    type: 'judge',
    category: '受限空间作业',
    question: '救援人员进入受限空间救援时，可以不佩戴防护用品。',
    answer: '错误',
    explanation: '救援人员进入受限空间时，必须佩戴防护用品，防止中毒或窒息。'
  },
  {
    id: 'cs_judge_009',
    type: 'judge',
    category: '受限空间作业',
    question: '受限空间作业时，只需要在入口处设置警示标志即可。',
    answer: '错误',
    explanation: '需要设置专职监护人，持续监护作业过程，确保安全。'
  },
  {
    id: 'cs_judge_010',
    type: 'judge',
    category: '受限空间作业',
    question: '进入受限空间作业前，气体检测结果合格后方可进入。',
    answer: '正确',
    explanation: '气体检测合格是进入受限空间作业的必要前提条件。'
  },

  // ==================== 填空题 (5道) ====================
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
  },
  {
    id: 'cs_fill_004',
    type: 'fill',
    category: '受限空间作业',
    question: '受限空间作业前应进行可靠的______，防止意外启动或能量释放。',
    answer: '隔离',
    explanation: '隔离措施包括断电、断气、断料等，确保设备不会意外启动。'
  },
  {
    id: 'cs_fill_005',
    type: 'fill',
    category: '受限空间作业',
    question: '在受限空间内作业时，应保持良好的______，必要时采取强制通风。',
    answer: '通风',
    explanation: '良好的通风是防止有毒有害气体积聚的重要措施。'
  }
];

export default confinedSpaceQuestions;
