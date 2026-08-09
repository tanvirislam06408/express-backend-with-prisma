import prisma from "../../lib/prisma.js";

interface CreateOrderData {
  quantity: number;
  userId: string;
  productId: string;
  totalPrice?: number;
}

interface UpdateOrderData {
  quantity?: number;
  totalPrice?: number;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  userId?: string;
  productId?: string;
}

// CREATE ORDER
export const createOrder = async (data: CreateOrderData) => {
  // Check user exists
  const user = await prisma.user.findFirst({
    where: {
      id: data.userId,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check product exists
  const product = await prisma.product.findFirst({
    where: {
      id: data.productId,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const totalPrice =
    data.totalPrice ?? product.price * data.quantity;

  const order = await prisma.order.create({
    data: {
      quantity: data.quantity,
      totalPrice,
      userId: data.userId,
      productId: data.productId,
    },
    include: {
      user: true,
      product: true,
    },
  });

  return order;
};

// GET ALL ORDERS
export const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

// GET ORDER BY ID
export const getOrderById = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      product: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

// UPDATE ORDER
export const updateOrder = async (
  id: string,
  data: UpdateOrderData
) => {
  // Check order exists
  const order = await prisma.order.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // If userId is being updated, check that user exists
  if (data.userId) {
    const user = await prisma.user.findFirst({
      where: {
        id: data.userId,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
  }

  // If productId is being updated, check that product exists
  if (data.productId) {
    const product = await prisma.product.findFirst({
      where: {
        id: data.productId,
        isDeleted: false,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id,
    },
    data,
    include: {
      user: true,
      product: true,
    },
  });

  return updatedOrder;
};

// SOFT DELETE ORDER
export const deleteOrder = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const deletedOrder = await prisma.order.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return deletedOrder;
};
