import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const healthCheck = pgTable("health_check", {
	id: integer("id").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 考试记录表
export const examRecords = pgTable(
  "exam_records",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workType: varchar("work_type", { length: 100 }).notNull(), // 工种
    name: varchar("name", { length: 100 }).notNull(), // 姓名
    idCard: varchar("id_card", { length: 100 }).notNull(), // 身份证号
    phone: varchar("phone", { length: 20 }).notNull(), // 电话
    photoKey: varchar("photo_key", { length: 500 }), // 照片存储key
    score: integer("score").notNull().default(0), // 分数
    answers: jsonb("answers").notNull().default({}), // 答题详情
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(), // 提交时间
  },
  (table) => [
    index("exam_records_submitted_at_idx").on(table.submittedAt), // 按时间排序
    index("exam_records_work_type_idx").on(table.workType), // 按工种过滤
  ]
);

export type ExamRecord = typeof examRecords.$inferSelect;
export type InsertExamRecord = typeof examRecords.$inferInsert;
