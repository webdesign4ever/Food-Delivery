import { relations } from "drizzle-orm";
import { boolean, decimal, integer, json, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    email: text("email").notNull(),
    role: text("role").notNull().default("user"), // user or admin
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// export const bagTypes = pgTable("bag_types", {
//     id: serial("id").primaryKey(),
//     name: text("name").notNull(),
//     price: decimal("price", { precision: 10, scale: 2 }).notNull(),
//     itemsLimit: integer("items_limit").notNull(),
//     description: text("description"),
//     isActive: boolean("is_active").default(true).notNull(),
// });

export const bagTypes = pgTable("bag_types", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(), // fruit or vegetable
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    itemsLimit: integer("items_limit").notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
});

// ✅ Step 2: Many-to-many relation tables
export const bagFixedItems = pgTable("bag_fixed_items", {
    bagTypeId: integer("bag_type_id").notNull().references(() => bagTypes.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
}, (t) => [
    primaryKey({ columns: [t.bagTypeId, t.productId] }),
])

export const bagCustomizableItems = pgTable("bag_customizable_items", {
    bagTypeId: integer("bag_type_id").notNull().references(() => bagTypes.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
}, (t) => [
    primaryKey({ columns: [t.bagTypeId, t.productId] }),
])

export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(), // fruit or vegetable
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    unit: text("unit").notNull(), // kg, piece, bunch
    imageUrl: text("image_url"),
    description: text("description"),
    isAvailable: boolean("is_available").default(true).notNull(),
    nutritionInfo: json("nutrition_info"),
});

export const customers = pgTable("customers", {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id").references(() => customers.id).notNull(),
    bagTypeId: integer("bag_type_id").references(() => bagTypes.id).notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: text("payment_method").notNull(), // easypaisa or jazzcash
    paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed
    orderStatus: text("order_status").notNull().default("processing"), // processing, confirmed, delivered, cancelled
    deliveryDate: timestamp("delivery_date"),
    specialInstructions: text("special_instructions"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
    id: serial("id").primaryKey(),
    orderId: integer("order_id").references(() => orders.id).notNull(),
    productId: integer("product_id").references(() => products.id).notNull(),
    quantity: decimal("quantity", { precision: 8, scale: 2 }).notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export const contactMessages = pgTable("contact_messages", {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    isReplied: boolean("is_replied").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
    id: serial("id").primaryKey(),
    orderId: integer("order_id").references(() => orders.id).notNull(),
    invoiceNumber: text("invoice_number").notNull(),
    issueDate: timestamp("issue_date").defaultNow().notNull(),
    dueDate: timestamp("due_date").notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0.00").notNull(),
    discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0.00").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: text("status").default("pending").notNull(), // pending, paid, overdue, cancelled
    paymentMethod: text("payment_method"),
    paidAt: timestamp("paid_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
    id: serial("id").primaryKey(),
    invoiceId: integer("invoice_id").references(() => invoices.id).notNull(),
    orderId: integer("order_id").references(() => orders.id).notNull(),
    paymentMethod: text("payment_method").notNull(), // easypaisa, jazzcash
    transactionId: text("transaction_id"),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: text("status").default("pending").notNull(), // pending, completed, failed
    paymentDate: timestamp("payment_date").defaultNow().notNull(),
    referenceNumber: text("reference_number"),
    processingFee: decimal("processing_fee", { precision: 10, scale: 2 }).default("0.00"),
    metadata: json("metadata"), // Store additional payment gateway data
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const billingRecords = pgTable("billing_records", {
    id: serial("id").primaryKey(),
    customerId: integer("customer_id").references(() => customers.id).notNull(),
    period: text("period").notNull(), // YYYY-MM format
    totalOrders: integer("total_orders").default(0).notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).default("0.00").notNull(),
    totalPaid: decimal("total_paid", { precision: 10, scale: 2 }).default("0.00").notNull(),
    totalPending: decimal("total_pending", { precision: 10, scale: 2 }).default("0.00").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
    orders: many(orders),
    billingRecords: many(billingRecords),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
    order: one(orders, {
        fields: [invoices.orderId],
        references: [orders.id],
    }),
    payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    invoice: one(invoices, {
        fields: [payments.invoiceId],
        references: [invoices.id],
    }),
    order: one(orders, {
        fields: [payments.orderId],
        references: [orders.id],
    }),
}));

export const billingRecordsRelations = relations(billingRecords, ({ one }) => ({
    customer: one(customers, {
        fields: [billingRecords.customerId],
        references: [customers.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    customer: one(customers, {
        fields: [orders.customerId],
        references: [customers.id],
    }),
    bagType: one(bagTypes, {
        fields: [orders.bagTypeId],
        references: [bagTypes.id],
    }),
    orderItems: many(orderItems),
    invoices: many(invoices),
    payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));

// export const bagTypesRelations = relations(bagTypes, ({ many }) => ({
//     orders: many(orders),
// }));

export const bagTypesRelations = relations(bagTypes, ({ many }) => ({
    orders: many(orders),
    fixedItems: many(bagFixedItems),
    customizableItems: many(bagCustomizableItems),
}))

export const bagFixedItemsRelations = relations(bagFixedItems, ({ one }) => ({
    bagType: one(bagTypes, {
        fields: [bagFixedItems.bagTypeId],
        references: [bagTypes.id],
    }),
    product: one(products, {
        fields: [bagFixedItems.productId],
        references: [products.id],
    }),
}))

export const bagCustomizableItemsRelations = relations(bagCustomizableItems, ({ one }) => ({
    bagType: one(bagTypes, {
        fields: [bagCustomizableItems.bagTypeId],
        references: [bagTypes.id],
    }),
    product: one(products, {
        fields: [bagCustomizableItems.productId],
        references: [products.id],
    }),
}))

export const productsRelations = relations(products, ({ many }) => ({
    orderItems: many(orderItems),
}));

// Insert schemas
// export const insertBagTypeSchema = createInsertSchema(bagTypes).omit({
//     id: true,
// });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = Omit<typeof users.$inferInsert, 'id' | 'createdAt'>;
//export type InsertUser = z.infer<typeof insertUserSchema>;

export type BagType = typeof bagTypes.$inferSelect;
export type InsertBagType = Omit<typeof bagTypes.$inferInsert, 'id'>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = Omit<typeof products.$inferInsert, 'id'>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = Omit<typeof customers.$inferInsert, 'id' | 'createdAt'>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = Omit<typeof orders.$inferInsert, 'id' | 'createdAt'>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = Omit<typeof orderItems.$inferInsert, 'id'>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = Omit<typeof contactMessages.$inferInsert, 'id' | 'createdAt' | 'isReplied'>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = Omit<typeof invoices.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = Omit<typeof payments.$inferInsert, 'id' | 'createdAt'>;

export type BillingRecord = typeof billingRecords.$inferSelect;
export type InsertBillingRecord = Omit<typeof billingRecords.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;
