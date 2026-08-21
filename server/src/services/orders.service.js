const { prisma } = require("../config/prisma");

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
      orderItems: true,
    },
    skip,
    take,
    where,
  });
  const count = await prisma.order.count({ where });
  const totalPages = Math.ceil(count / take);
  return { orders, count, totalPages };
};

const createOrderService = async (userId, checkoutData) => {
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
      orders: true,
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
  });
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

module.exports = {
  getOrdersService,
  createOrderService,
  getUsersOrderService,
  getSpecificOrderService,
  updateOrderStatusService,
};
