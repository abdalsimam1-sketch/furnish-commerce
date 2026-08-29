const { prisma } = require("../config/prisma");
const { ForbiddenError, NotFoundError, ConflictError } = require("../errors");

const getOrdersService = async (page, limit, search, status) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const where = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    skip,
    take,
    where,
  });
  const count = await prisma.order.count({ where });
  const totalPages = Math.ceil(count / take);
  return { orders, count, totalPages };
};

const createOrderService = async (userId, checkoutData, reference) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      cart: {
        include: {
          cartItems: { include: { product: true } },
        },
      },
    },
  });
  const cartItems = user?.cart?.cartItems;
  const total = cartItems?.reduce(
    (sum, item) => sum + Number(item?.product?.price) * item?.quantity,
    0,
  );
  const existing = await prisma.payment.findUnique({
    where: {
      reference,
    },
  });
  if (existing) {
    throw new ConflictError("Duplicate payments are not allowed");
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        email: checkoutData.email,
        streetAddress: checkoutData.streetAddress,
        country: "Nigeria",
        phone: checkoutData.phone,
        city: checkoutData.city,
        state: checkoutData.state,
        zipCode: checkoutData.zipCode,
        customerId: userId,
        total,
      },
    });
    await Promise.all(
      cartItems.map((item) =>
        tx.orderItem.create({
          data: {
            quantity: item.quantity,
            orderId: order.id,
            price: item.product.price,
            productId: item.product.id,
          },
        }),
      ),
    );

    await tx.payment.create({
      data: {
        reference,
        amount: order.total,
        orderId: order.id,
        status: "success",
      },
    });
    await Promise.all(
      cartItems.map((item) =>
        tx.product.update({
          where: { id: item.product.id },
          data: {
            inStock: item.product.inStock - item.quantity,
          },
        }),
      ),
    );
    await tx.cartItem.deleteMany({
      where: {
        cartId: user?.cart?.id,
      },
    });
    return order;
  });
  return result;
};

const getUsersOrderService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
  const orders = user?.orders;
  return orders;
};
const getSpecificOrderService = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  return order;
};
const updateOrderStatusService = async (orderId, status) => {
  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: { status },
  });
  return order;
};

const cancelOrderService = async (orderId) => {
  let order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  if (order.status !== "pending") {
    throw new ForbiddenError("Only pending orders can be cancelled");
  }
  order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "cancelled",
    },
  });

  return order;
};

const getOrderByReferenceService = async (paymentReference) => {
  const payment = await prisma.payment.findUnique({
    where: {
      reference: paymentReference,
    },
    include: {
      order: {
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!payment) {
    throw new NotFoundError("Payment details not found");
  }
  const order = payment?.order;

  return order;
};

module.exports = {
  getOrdersService,
  createOrderService,
  getUsersOrderService,
  getSpecificOrderService,
  updateOrderStatusService,
  cancelOrderService,
  getOrderByReferenceService,
};
