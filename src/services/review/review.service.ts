import prisma from "../../lib/prisma.js";

interface CreateReviewData {
  rating: number;
  comment?: string;
  userId: string;
  productId: string;
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
  userId?: string;
  productId?: string;
}

// CREATE REVIEW
export const createReview = async (data: CreateReviewData) => {
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

  const review = await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment ?? null,
      userId: data.userId,
      productId: data.productId,
    },
    include: {
      user: true,
      product: true,
    },
  });

  return review;
};

// GET ALL REVIEWS
export const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
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

  return reviews;
};

// GET REVIEW BY ID
export const getReviewById = async (id: string) => {
  const review = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      product: true,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

// UPDATE REVIEW
export const updateReview = async (
  id: string,
  data: UpdateReviewData
) => {
  // Check review exists
  const review = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new Error("Review not found");
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

  const updatedReview = await prisma.review.update({
    where: {
      id,
    },
    data,
    include: {
      user: true,
      product: true,
    },
  });

  return updatedReview;
};

// SOFT DELETE REVIEW
export const deleteReview = async (id: string) => {
  const review = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  const deletedReview = await prisma.review.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return deletedReview;
};
