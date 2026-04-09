// 八大特殊作业与非常规作业安全常识题库

export interface Question {
  id: string;
  type: 'choice' | 'judge' | 'fill';
  question: string;
  options?: string[];  // 选择题选项
  answer: string;      // 正确答案
  explanation: string; // 解析
  category: string;   // 分类
}

// 八大特殊作业：动火作业、受限空间作业、盲板抽堵作业、高处作业、吊装作业、临时用电作业、破土作业、断路作业

export const questions: Question[] = [
  // ==================== 选择题 (10道) ====================
  {
    id: 'choice_001',
    type: 'choice',
    category: '动火作业',
    question: '在易燃易爆场所进行动火作业时，氧气的含量应控制在多少以下？',
    options: ['A. 21%', 'B. 23.5%', 'C. 25%', 'D. 30%'],
    answer: 'B',
    explanation: '氧含量低于23.5%时不易燃，防止富氧环境引发火灾。'
  },
  {
    id: 'choice_002',
    type: 'choice',
    category: '受限空间作业',
    question: '进入受限空间作业前必须进行哪项检测？',
    options: ['A. 温度检测', 'B. 可燃气体、有毒气体和氧含量检测', 'C. 湿度检测', 'D. 噪音检测'],
    answer: 'B',
    explanation: '必须检测可燃气体、有毒气体和氧含量，确保作业安全。'
  },
  {
    id: 'choice_003',
    type: 'choice',
    category: '高处作业',
    question: '高处作业是指在坠落高度基准面多少米以上的作业？',
    options: ['A. 1米', 'B. 2米', 'C. 3米', 'D. 5米'],
    answer: 'B',
    explanation: '根据规定，坠落高度基准面2米及2米以上的作业为高处作业。'
  },
  {
    id: 'choice_004',
    type: 'choice',
    category: '吊装作业',
    question: '吊装作业时，吊物下方多远范围内禁止有人停留或通过？',
    options: ['A. 3米', 'B. 5米', 'C. 10米', 'D. 15米'],
    answer: 'C',
    explanation: '吊装作业时，吊物下方10米范围内为危险区域，禁止人员停留或通过。'
  },
  {
    id: 'choice_005',
    type: 'choice',
    category: '临时用电作业',
    question: '临时用电设备应安装漏电保护器，漏电动作电流一般不大于多少毫安？',
    options: ['A. 10mA', 'B. 30mA', 'C. 50mA', 'D. 100mA'],
    answer: 'B',
    explanation: '一般干燥环境漏电动作电流不大于30mA，确保人员触电时快速断电。'
  },
  {
    id: 'choice_006',
    type: 'choice',
    category: '盲板抽堵作业',
    question: '盲板抽堵作业时，盲板应安装在何处？',
    options: ['A. 阀门的上游侧', 'B. 阀门的下游侧', 'C. 两个阀门之间', 'D. 管道的任意位置'],
    answer: 'C',
    explanation: '盲板应安装在两个阀门之间，确保有效隔离。'
  },
  {
    id: 'choice_007',
    type: 'choice',
    category: '受限空间作业',
    question: '受限空间作业时，监护人应多久与作业人员联系一次？',
    options: ['A. 5分钟', 'B. 10分钟', 'C. 15分钟', 'D. 30分钟'],
    answer: 'B',
    explanation: '监护人应至少每隔10分钟与作业人员联系一次，确保人员安全。'
  },
  {
    id: 'choice_008',
    type: 'choice',
    category: '断路作业',
    question: '在道路上进行断路作业时，应设置多少米外的安全设施？',
    options: ['A. 5米', 'B. 10米', 'C. 15-20米', 'D. 30米'],
    answer: 'C',
    explanation: '断路作业应在距作业点15-20米外设置安全设施和警示标志。'
  },
  {
    id: 'choice_009',
    type: 'choice',
    category: '破土作业',
    question: '破土作业前应首先了解地下管网情况，应向哪个部门查询？',
    options: ['A. 安全部门', 'B. 设备部门', 'C. 属地单位和有关地下管线的主管单位', 'D. 政府部门'],
    answer: 'C',
    explanation: '应向属地单位和有关地下管线的主管单位查询，确保施工安全。'
  },
  {
    id: 'choice_010',
    type: 'choice',
    category: '高处作业',
    question: '高处作业人员应定期进行体检，以下哪类人员不适合高处作业？',
    options: ['A. 血压正常者', 'B. 患有高血压、心脏病的人员', 'C. 体重正常的', 'D. 无恐高症的'],
    answer: 'B',
    explanation: '患有高血压、心脏病、恐高症等人员不适合从事高处作业。'
  },

  // ==================== 判断题 (10道) ====================
  {
    id: 'judge_001',
    type: 'judge',
    category: '动火作业',
    question: '在易燃易爆场所进行动火作业时，只需要办理动火证即可作业。',
    answer: '错误',
    explanation: '办理动火证只是基本要求，还需进行气体检测、清除周围易燃物、配备消防器材等安全措施。'
  },
  {
    id: 'judge_002',
    type: 'judge',
    category: '受限空间作业',
    question: '受限空间作业时，为了方便沟通，作业人员可以将便携式气体检测仪放在一旁。',
    answer: '错误',
    explanation: '便携式气体检测仪应随身携带，实时监测作业环境中的气体浓度变化。'
  },
  {
    id: 'judge_003',
    type: 'judge',
    category: '高处作业',
    question: '高处作业只要系好安全带就可以不系安全绳。',
    answer: '错误',
    explanation: '高处作业应同时使用安全带和安全绳，双重保险确保作业人员安全。'
  },
  {
    id: 'judge_004',
    type: 'judge',
    category: '吊装作业',
    question: '吊装作业时，可以用吊车吊人。',
    answer: '错误',
    explanation: '严禁用吊车吊运人员，吊人极易造成人员坠落事故。'
  },
  {
    id: 'judge_005',
    type: 'judge',
    category: '临时用电作业',
    question: '临时用电作业可以不用办理临时用电作业许可证。',
    answer: '错误',
    explanation: '临时用电作业必须办理临时用电作业许可证，经审批后方可作业。'
  },
  {
    id: 'judge_006',
    type: 'judge',
    category: '盲板抽堵作业',
    question: '盲板抽堵作业时，作业人员应站在上风口位置。',
    answer: '正确',
    explanation: '站在上风口可以避免有毒有害气体对人体的伤害。'
  },
  {
    id: 'judge_007',
    type: 'judge',
    category: '断路作业',
    question: '断路作业完成后，作业单位应通知相关部门撤除安全设施。',
    answer: '正确',
    explanation: '断路作业完成后，应及时通知相关部门撤除安全设施，恢复交通。'
  },
  {
    id: 'judge_008',
    type: 'judge',
    category: '破土作业',
    question: '破土作业时，可以使用机械挖掘深5米的沟槽。',
    answer: '错误',
    explanation: '机械挖掘深度超过2米时应设置防护支撑，防止塌方。'
  },
  {
    id: 'judge_009',
    type: 'judge',
    category: '受限空间作业',
    question: '进入受限空间作业时，监护人因临时有事可以短时间离开。',
    answer: '错误',
    explanation: '监护人不得擅自离开作业现场，应全程监护并保持与作业人员的联系。'
  },
  {
    id: 'judge_010',
    type: 'judge',
    category: '高处作业',
    question: '六级以上强风和大雨、大雪、大雾天气可以从事高处作业。',
    answer: '错误',
    explanation: '六级以上强风、大雨、大雪、大雾天气禁止高处作业，因视线受阻和作业条件恶劣。'
  },

  // ==================== 填空题 (5道) ====================
  {
    id: 'fill_001',
    type: 'fill',
    category: '动火作业',
    question: '动火作业前必须办理______，并清除周围易燃易爆物品，配备消防器材。',
    answer: '动火作业许可证',
    explanation: '动火作业许可证是动火作业的基本安全要求。'
  },
  {
    id: 'fill_002',
    type: 'fill',
    category: '受限空间作业',
    question: '进入受限空间作业必须进行氧含量、可燃气体和______检测合格后方可作业。',
    answer: '有毒气体',
    explanation: '有毒气体检测是确保受限空间作业安全的重要环节。'
  },
  {
    id: 'fill_003',
    type: 'fill',
    category: '高处作业',
    question: '高处作业人员必须佩戴安全带、安全帽等个人防护装备，安全带应______挂在牢固构件上。',
    answer: '高挂低用',
    explanation: '高挂低用是安全带的标准挂法，可以减小坠落距离。'
  },
  {
    id: 'fill_004',
    type: 'fill',
    category: '吊装作业',
    question: '吊装作业前必须检查起重机的______、制动器、限位装置等安全装置是否灵敏可靠。',
    answer: '吊具',
    explanation: '吊具是吊装作业的核心设备，必须确保安全可靠。'
  },
  {
    id: 'fill_005',
    type: 'fill',
    category: '临时用电作业',
    question: '临时用电设备必须安装漏电保护器，实行一机一闸一______制度。',
    answer: '漏电保护',
    explanation: '一机一闸一漏电保护是临时用电的基本安全要求。'
  }
];

// 按类型分组
export const choiceQuestions = questions.filter(q => q.type === 'choice');
export const judgeQuestions = questions.filter(q => q.type === 'judge');
export const fillQuestions = questions.filter(q => q.type === 'fill');

// 打乱顺序
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
