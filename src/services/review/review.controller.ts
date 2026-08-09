import type { Request, Response } from "express";

import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "./review.service.js";

// CREATE
export const create = async (
  req: Request,
  res: Response
) => {
  try {
    const review = await createReview(req.body);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create review",
      data: null,
    });
  }
};

// GET ALL
export const getAll = async (
  req: Request,
  res: Response
) => {
  try {
    const reviews = await getAllReviews();

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews",
      data: null,
    });
  }
};

// GET BY ID
export const getById = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid review id",
      data: null,
    });
  }

  try {
    const review = await getReviewById(id);

    res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Review not found",
      data: null,
    });
  }
};

// UPDATE
export const update = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid review id",
      data: null,
    });
  }

  try {
    const review = await updateReview(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update review",
      data: null,
    });
  }
};

// SOFT DELETE
export const remove = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid review id",
      data: null,
    });
  }

  try {
    await deleteReview(id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Review not found",
      data: null,
    });
  }
};
