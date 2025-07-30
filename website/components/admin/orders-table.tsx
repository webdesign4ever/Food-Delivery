import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Edit, CheckCircle, Clock, Truck, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Order, Customer, BoxType, OrderData } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { FaWhatsapp } from "react-icons/fa";

interface OrdersTableProps {
  orders: (Order & { customer: Customer; bagType: BoxType; orderItems: any[] })[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof filteredOrders[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      return apiRequest("PUT", `/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      return apiRequest("PUT", `/orders/${orderId}/payment`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/orders"] });
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    },
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);

    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "delivered":
        return <Truck className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-[hsla(46,84%,64%,0.2)] text-sunny-yellow";
      //return "bg-sunny-yellow/20 text-sunny-yellow";
      case "confirmed":
        return "bg-blue-100 text-blue-600";
      case "delivered":
        return "bg-[hsla(103,38%,57%,0.2)] text-fresh-green";
      //return "bg-fresh-green/20 text-fresh-green";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[hsla(103,38%,57%,0.2)] text-fresh-green";
      // return "bg-fresh-green/20 text-fresh-green";
      case "pending":
        return "bg-[hsla(46,84%,64%,0.2)] text-sunny-yellow";
      // return "bg-sunny-yellow/20 text-sunny-yellow";
      case "failed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const items = selectedOrder?.orderItems ?? [];

  // Calculate total for this bag
  const boxTotal = items?.reduce(
    (sum, item) => sum + parseFloat(item.unitPrice) * item.quantity,
    0
  );

  const buildWhatsAppMessage = (order: typeof filteredOrders[0]) => {
    console.log(order)
    const itemsText = order.orderItems.map((item) =>
      `• ${item.product.name} (${item.product.category}) - Qty: ${item.quantity} ${item.product.unit}`
    ).join('\n');

    const message = `
*FreshBox Order Details*

🍽 *Order Info*

📦 *Order Number:* #FB-${order.id.toString().padStart(3, '0')}
📅 *Date:* ${new Date(order.createdAt).toLocaleDateString()}
📌 *Status:* ${order.orderStatus}
💳 *Payment:* ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})
📝 *Instructions:* ${order.specialInstructions || "N/A"}

👤 *Customer Info*
• Name: ${order.customer.firstName} ${order.customer.lastName}
• Phone: ${order.customer.phone}
• Email: ${order.customer.email}
• Address: ${order.customer.address}, ${order.customer.city}

🧺 *Order Details:*
📦 *Bag:* ${order.bagType.name} (${order.orderItems.length} item${order.orderItems.length > 1 ? 's' : ''})

${itemsText}

💰 *Total:* Rs. ${order.totalAmount}`
      .trim();

    return message;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders by customer, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Box Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        #FB-{order.id.toString().padStart(3, "0")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{order.customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.bagType.name}</TableCell>
                      <TableCell className="font-semibold">Rs. {order.totalAmount}</TableCell>
                      <TableCell>
                        {/* <div className="space-y-1">
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </Badge>
                          <p className="text-xs text-gray-600 capitalize">
                            {order.paymentMethod}
                          </p>
                        </div> */}
                        <div className="space-y-1">
                          <Select
                            value={order.paymentStatus}
                            onValueChange={(status) =>
                              updatePaymentStatusMutation.mutate({ orderId: order.id, status })
                            }
                          >
                            <SelectTrigger className={`w-44 ${getPaymentStatusColor(order.paymentStatus)}`}>
                              <div className="flex items-end space-x-2">
                                <p className="text-xs text-gray-600 capitalize">
                                  {order.paymentMethod}
                                </p>
                                {/* <Badge className={`text-xs text-gray-600 capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                                  {order.paymentMethod}
                                </Badge> */}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                          {/* <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </Badge>
                          <p className="text-xs text-gray-600 capitalize">
                            {order.paymentMethod}
                          </p> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={order.orderStatus}
                            onValueChange={(status) =>
                              updateOrderStatusMutation.mutate({ orderId: order.id, status })
                            }
                          >
                            <SelectTrigger //className="w-32"
                              className={`w-36 ${getOrderStatusColor(order.orderStatus)}`}
                            >
                              <div className="flex items-center space-x-2">
                                {getOrderStatusIcon(order.orderStatus)}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline"
                            onClick={() => {
                              //setSelectedOrder(order); // optional if used elsewhere
                              const message = buildWhatsAppMessage(order);
                              console.log("message", JSON.stringify(message));
                              const encodedMessage = encodeURIComponent(message);
                              console.log("encodedMessage", encodedMessage)
                              window.open(`https://web.whatsapp.com/send?phone=923088248017&text=${encodedMessage}`, "_blank");

                              // const whatsappUrl = `https://wa.me/923088248017?text=${encodedMessage}`; // replace <PHONE_NUMBER>
                              // window.open(whatsappUrl, '_blank');
                            }}
                          >
                            <FaWhatsapp className="w-4 h-4" />
                          </Button>

                          <Button size="sm" variant="outline"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">
                        {searchTerm || statusFilter !== "all" || paymentFilter !== "all" ? (
                          <>
                            <div className="text-4xl mb-2">🔍</div>
                            <p>No orders match your search criteria</p>
                          </>
                        ) : (
                          <>
                            <div className="text-4xl mb-2">📦</div>
                            <p>No orders found</p>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent >
      </Card >

      {/* Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} >
        <DialogContent className="max-h-[98vh] md:max-w-[60vw] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {/* Details for Order #FB-{selectedOrder?.id.toString().padStart(3, "0")} */}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder ? (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-light-green-tint p-4 rounded-lg">
                <h3 className="font-semibold text-dark-text mb-2">Order Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Order Number:</span> #FB-{selectedOrder?.id.toString().padStart(3, "0")}</p>
                  <p><span className="font-medium">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Order Status:</span> {selectedOrder.orderStatus}</p>
                  {/* <p><span className="font-medium">Estimated Delivery:</span> {new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p> */}
                  <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod.toUpperCase()} ({selectedOrder.paymentStatus})</p>

                  {selectedOrder.specialInstructions &&
                    <p><span className="font-medium">Order Instructions:</span> {selectedOrder.specialInstructions}</p>}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-dark-text mb-2">Delivery Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                  <p><span className="font-medium">Address:</span> {selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-dark-text mb-2">Order Details</h3>
                <div className="space-y-3">
                  {(() => {
                    // Group all items under bagType name
                    const boxName = selectedOrder.bagType?.name;

                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-light-green-tint rounded">
                          <div>
                            <span className="font-medium">{boxName}</span>
                            <p className="text-sm text-gray-600">{items.length} item{items.length > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Rs. {selectedOrder.bagType.price}</p>
                            {/* <p className="font-medium">Rs. {boxTotal.toFixed(2)}</p> */}
                          </div>
                        </div>

                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded ml-4">
                            <div>
                              <span className="font-medium">{item.product.name}</span>
                              <p className="text-sm text-gray-600">{item.product.category}</p>
                            </div>
                            <div className="text-right">
                              {/* <p className="font-medium">Rs. {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</p> */}
                              <p className="text-sm text-gray-600">Qty: {item.quantity} {item.product.unit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    {/* <span>Rs. {boxTotal.toFixed(2)}</span> */}
                    <span>Rs. {selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-fresh-green">
                    <span>Total Amount:</span>
                    <span>Rs. {selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* <div>
                <h4 className="font-semibold">Customer</h4>
                <p>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
              </div>

              <div>
                <h4 className="font-semibold">Order Summary</h4>
                <p>Bag Type: {selectedOrder.bagType.name}</p>
                <p>Total Amount: Rs. {selectedOrder.totalAmount}</p>
                <p>Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
                <p>Status: {selectedOrder.orderStatus}</p>
                <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <h4 className="font-semibold">Ordered Items</h4>
                <ul className="space-y-2">
                  {selectedOrder.orderItems.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.product.name}</span>
                      <span>{item.quantity} x Rs.{item.unitPrice}</span>
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </DialogContent>
      </Dialog >

      {/* Summary */}
      {
        filteredOrders.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-fresh-green">{filteredOrders.length}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-sunny-yellow">
                    {filteredOrders.filter(o => o.orderStatus === "processing").length}
                  </p>
                  <p className="text-sm text-gray-600">Processing</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-fresh-green">
                    {filteredOrders.filter(o => o.orderStatus === "delivered").length}
                  </p>
                  <p className="text-sm text-gray-600">Delivered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark-text">
                    Rs. {filteredOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    </div >
  );
}
