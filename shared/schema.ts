import { sqliteTable, text, integer, blob, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isAdmin: integer("is_admin", { mode: 'boolean' }).default(false).notNull(),
  role: text("role").$type<"user" | "admin" | "guest_manager">().notNull().default("user"),
  hasPaidSubscription: integer("has_paid_subscription", { mode: 'boolean' }).default(false).notNull(),
  paymentMethod: text("payment_method"), // 'click', 'payme', or null
  paymentOrderId: text("payment_order_id"),
  paymentDate: integer("payment_date", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const weddings = sqliteTable("weddings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  uniqueUrl: text("unique_url").notNull().unique(),
  bride: text("bride").notNull(),
  groom: text("groom").notNull(),
  weddingDate: integer("wedding_date", { mode: 'timestamp' }).notNull(),
  weddingTime: text("wedding_time").notNull().default("4:00 PM"),
  timezone: text("timezone").notNull().default("Asia/Tashkent"),
  venue: text("venue").notNull(),
  venueAddress: text("venue_address").notNull(),
  venueCoordinates: text("venue_coordinates", { mode: 'json' }).$type<{ lat: number; lng: number }>(),
  mapPinUrl: text("map_pin_url"),
  story: text("story"),
  welcomeMessage: text("welcome_message"),
  dearGuestMessage: text("dear_guest_message"),
  couplePhotoUrl: text("couple_photo_url"),
  backgroundTemplate: text("background_template").default("template1"),
  template: text("template").notNull().default("garden-romance"),
  primaryColor: text("primary_color").notNull().default("#D4B08C"),
  accentColor: text("accent_color").notNull().default("#89916B"),
  backgroundMusicUrl: text("background_music_url"),
  isPublic: integer("is_public", { mode: 'boolean' }).notNull().default(true),
  availableLanguages: text("available_languages", { mode: 'json' }).$type<string[]>().notNull().$defaultFn(() => ['en']),
  defaultLanguage: text("default_language").notNull().default("en"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const guests = sqliteTable("guests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weddingId: integer("wedding_id").references(() => weddings.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  rsvpStatus: text("rsvp_status").$type<"pending" | "confirmed" | "declined" | "maybe">().notNull().default("pending"),
  responseText: text("response_text"), // Store the exact response text chosen by guest
  plusOne: integer("plus_one", { mode: 'boolean' }).notNull().default(false),
  plusOneName: text("plus_one_name"),
  additionalGuests: integer("additional_guests").notNull().default(0),
  message: text("message"),
  category: text("category").notNull().default("family"), // family, friends, colleagues, etc.
  side: text("side").$type<"bride" | "groom" | "both">().notNull().default("both"),
  dietaryRestrictions: text("dietary_restrictions"),
  address: text("address"),
  invitationSent: integer("invitation_sent", { mode: 'boolean' }).notNull().default(false),
  invitationSentAt: integer("invitation_sent_at", { mode: 'timestamp' }),
  addedBy: text("added_by").notNull().default("couple"), // couple, family, friend
  notes: text("notes"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  respondedAt: integer("responded_at", { mode: 'timestamp' }),
});

export const photos = sqliteTable("photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weddingId: integer("wedding_id").references(() => weddings.id).notNull(),
  url: text("url").notNull(),
  caption: text("caption"),
  isHero: integer("is_hero", { mode: 'boolean' }).notNull().default(false),
  photoType: text("photo_type").$type<"couple" | "memory" | "hero">().notNull().default("memory"),
  uploadedAt: integer("uploaded_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const guestBookEntries = sqliteTable("guest_book_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weddingId: integer("wedding_id").references(() => weddings.id).notNull(),
  guestName: text("guest_name").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const budgetCategories = sqliteTable("budget_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weddingId: integer("wedding_id").references(() => weddings.id).notNull(),
  name: text("name").notNull(),
  estimatedCost: integer("estimated_cost").notNull(),
  actualCost: integer("actual_cost").notNull().default(0),
  isPaid: integer("is_paid", { mode: 'boolean' }).notNull().default(false),
  priority: text("priority").notNull().default("medium"), // high, medium, low
  notes: text("notes"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const budgetItems = sqliteTable("budget_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => budgetCategories.id).notNull(),
  name: text("name").notNull(),
  estimatedCost: integer("estimated_cost").notNull(),
  actualCost: integer("actual_cost").notNull().default(0),
  isPaid: integer("is_paid", { mode: 'boolean' }).notNull().default(false),
  vendor: text("vendor"),
  dueDate: integer("due_date", { mode: 'timestamp' }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const milestones = sqliteTable("milestones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weddingId: integer("wedding_id").references(() => weddings.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: integer("target_date", { mode: 'timestamp' }).notNull(),
  isCompleted: integer("is_completed", { mode: 'boolean' }).notNull().default(false),
  completedAt: integer("completed_at", { mode: 'timestamp' }),
  celebrationMessage: text("celebration_message"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const invitations = sqliteTable("invitations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guestId: integer("guest_id").references(() => guests.id).notNull(),
  weddingId: integer("wedding_id").references(() => weddings.id).notNull(),
  invitationType: text("invitation_type").notNull().default("email"), // email, sms, whatsapp
  invitationTemplate: text("invitation_template").notNull().default("classic"),
  sentAt: integer("sent_at", { mode: 'timestamp' }),
  deliveredAt: integer("delivered_at", { mode: 'timestamp' }),
  openedAt: integer("opened_at", { mode: 'timestamp' }),
  status: text("status").notNull().default("pending"), // pending, sent, delivered, opened, failed
  errorMessage: text("error_message"),
  reminderSentAt: integer("reminder_sent_at", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const guestCollaborators = sqliteTable("guest_collaborators", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weddingId: integer("wedding_id").references(() => weddings.id).notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("editor"), // viewer, editor, admin
  invitedAt: integer("invited_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  acceptedAt: integer("accepted_at", { mode: 'timestamp' }),
  lastActiveAt: integer("last_active_at", { mode: 'timestamp' }),
  status: text("status").notNull().default("pending"), // pending, active, inactive
});

export const weddingAccess = sqliteTable("wedding_access", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  weddingId: integer("wedding_id").references(() => weddings.id).notNull(),
  accessLevel: text("access_level").$type<"owner" | "guest_manager" | "viewer">().notNull().default("viewer"),
  permissions: text("permissions", { mode: 'json' }).$type<{
    canEditDetails: boolean;
    canManageGuests: boolean;
    canViewAnalytics: boolean;
    canManagePhotos: boolean;
    canEditGuestBook: boolean;
  }>().notNull().$defaultFn(() => ({
    canEditDetails: false,
    canManageGuests: false,
    canViewAnalytics: false,
    canManagePhotos: false,
    canEditGuestBook: false
  })),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWeddingSchema = createInsertSchema(weddings).omit({
  id: true,
  userId: true,
  uniqueUrl: true,
  createdAt: true,
});

export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  createdAt: true,
  respondedAt: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  uploadedAt: true,
});

export const insertGuestBookEntrySchema = createInsertSchema(guestBookEntries).omit({
  id: true,
  createdAt: true,
});

export const insertBudgetCategorySchema = createInsertSchema(budgetCategories).omit({
  id: true,
  createdAt: true,
});

export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({
  id: true,
  createdAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertInvitationSchema = createInsertSchema(invitations).omit({
  id: true,
  createdAt: true,
});

export const insertGuestCollaboratorSchema = createInsertSchema(guestCollaborators).omit({
  id: true,
  invitedAt: true,
});

export const insertWeddingAccessSchema = createInsertSchema(weddingAccess).omit({
  id: true,
  createdAt: true,
});

export const rsvpUpdateSchema = z.object({
  rsvpStatus: z.enum(["confirmed", "declined", "maybe"]),
  responseText: z.string().optional(),
  message: z.string().optional(),
  plusOne: z.boolean().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Wedding = typeof weddings.$inferSelect;
export type InsertWedding = z.infer<typeof insertWeddingSchema>;

export type Guest = typeof guests.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;

export type GuestBookEntry = typeof guestBookEntries.$inferSelect;
export type InsertGuestBookEntry = z.infer<typeof insertGuestBookEntrySchema>;

export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type InsertBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;

export type BudgetItem = typeof budgetItems.$inferSelect;
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;

export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;

export type GuestCollaborator = typeof guestCollaborators.$inferSelect;
export type InsertGuestCollaborator = z.infer<typeof insertGuestCollaboratorSchema>;

export type WeddingAccess = typeof weddingAccess.$inferSelect;
export type InsertWeddingAccess = z.infer<typeof insertWeddingAccessSchema>;

export type RSVPUpdate = z.infer<typeof rsvpUpdateSchema>;
