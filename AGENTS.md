# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
│   ├── build.sh            # 构建脚本
│   ├── dev.sh              # 开发环境启动脚本
│   ├── prepare.sh          # 预处理脚本
│   └── start.sh            # 生产环境启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   ├── questions/      # 题库模块（按工种拆分）
│   │   │   ├── confined-space.ts  # 受限空间作业题库
│   │   │   ├── lifting.ts         # 吊装作业题库
│   │   │   ├── comprehensive.ts   # 综合作业题库
│   │   │   └── index.ts           # 题库导出与配置
│   │   └── utils.ts        # 通用工具函数 (cn)
│   ├── storage/            # 存储集成
│   │   └── database/       # Supabase 数据库集成
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

### API 路由集成

- 使用项目内置的 Supabase 客户端：`import { getSupabaseClient } from '@/storage/database/supabase-client'`
- **禁止**直接使用 `@supabase/supabase-js` 的 `createClient`，会导致构建时环境变量问题

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**

## 项目功能说明

### 安全生产培训考核系统

本系统用于八大特殊作业与非常规作业的安全常识考试。支持按工种选择不同的答题模块。

### 页面路由

- `/` - 首页（考试模块选择、入口、管理端入口）
- `/exam` - 考试页面（模块选择 → 信息填写 → 答题 → 拍照上传 → 提交）
- `/admin` - 管理端（查看所有考试成绩、搜索筛选）

### 数据库表

- `exam_records` - 考试记录表
  - `work_type` - 公司名称
  - `exam_module` - 考试模块ID（confined_space/lifting/comprehensive）
  - `name` - 姓名
  - `id_card` - 身份证号
  - `phone` - 电话
  - `photo_key` - 照片存储key
  - `score` - 分数
  - `answers` - 答题详情JSON
  - `submitted_at` - 提交时间

### API 接口

- `GET /api/exam` - 获取考试记录列表（支持按公司名称、考试模块、日期范围筛选）
- `POST /api/exam` - 提交考试成绩（包含公司名称、考试模块、答题信息、照片）
- `GET /api/exam/records/[id]` - 获取考试记录详情

### 题库结构

- **三个独立题库模块**，统一结构：
  - 受限空间作业（confined_space）
  - 吊装作业（lifting）
  - 动火/临时用电/高处作业综合（comprehensive）
- 每个模块包含：
  - 10道选择题（每题5分）
  - 10道判断题（每题3分）
  - 5道填空题（每题6分）
  - 总分100分，**及格分数 80 分**

### 照片上传

- 使用 S3Storage 对象存储
- 照片作为考试凭证，**必须上传才能提交**

### 管理端

- 密码保护（默认密码：admin123）
- 支持按姓名、公司名称、手机号、身份证号搜索
- **列表页显示**：姓名、公司名称（带图标）、身份证号（部分隐藏）、手机号（部分隐藏）、考试模块、成绩
- **详情页显示**：完整信息包括姓名、公司名称、身份证号、手机号、考试模块、提交时间、成绩
- 查看答题详情

### UI 特性

- 蓝色系主题
- 手机端优先的大按钮设计
- 响应式布局（移动端/桌面端适配）
- 实时答题进度显示
- 快速跳转答题
