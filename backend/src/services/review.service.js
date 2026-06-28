const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createReview = async (data, userId = null) => {
  const reviewData = {
    rating: data.rating,
    content: data.content,
    productId: null, // Optional in updated schema for public application reviews
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
};
