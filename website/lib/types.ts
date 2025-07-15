export interface BoxType {
  id: number;
  name: string;
  price: string;
  itemsLimit: number;
  description?: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: "fruit" | "vegetable";
  price: string;
  unit: string;
  imageUrl?: string;
  description?: string;
  isAvailable: boolean;
  nutritionInfo?: any;
}

export interface CartItem {
  product: Product;
  quantity: number;
  sourceBoxType?: BoxType; // Track which box type this item was added from
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface OrderData {
  customer: Customer;
  boxTypeId: number;
  totalAmount: string;
  paymentMethod: "easypaisa" | "jazzcash";
  deliveryDate?: string;
  specialInstructions?: string;
  items: Array<{
    productId: number;
    quantity: string;
    unitPrice: string;
  }>;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: string;
  totalCustomers: number;
  totalProducts: number;
}

export interface Invoice {
  id: number;
  orderId: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  totalAmount: string;
  status: string;
  paymentMethod?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  invoiceId: number;
  orderId: number;
  paymentMethod: string;
  transactionId?: string;
  amount: string;
  status: string;
  paymentDate: string;
  referenceNumber?: string;
  processingFee: string;
  metadata?: any;
  createdAt: string;
}

export interface BillingRecord {
  id: number;
  customerId: number;
  period: string;
  totalOrders: number;
  totalAmount: string;
  totalPaid: string;
  totalPending: string;
  createdAt: string;
  updatedAt: string;
}
