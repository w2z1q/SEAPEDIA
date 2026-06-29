const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createReview = async (data, userId = null) => {
  const reviewData = {
    rating: data.rating,
    content: data.content,
    productId: data.productId || null,
  };

  if (userId) {
    reviewData.userId = userId;
    reviewData.guestName = null;
  } else {
    reviewData.guestName = data.guestName;
    reviewData.userId = null;
  }

  const review = await prisma.review.create({
    data: reviewData,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return review;
};

const getReviews = async () => {
  const reviews = await prisma.review.findMany({
    where: { productId: null },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return reviews;
};

const getProductReviews = async (productId) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return reviews;
};

module.exports = {
  createReview,
  getReviews,
  getProductReviews,
};
