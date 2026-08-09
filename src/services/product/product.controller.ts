import { Request, Response } from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.service.js";

// CREATE
export const create = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create product",
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
    const products = await getAllProducts();

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      data: null,
    });
  }
};

// GET BY ID
export const getById = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await getProductById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Product not found",
      data: null,
    });
  }
};

// UPDATE
export const update = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await updateProduct(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update product",
      data: null,
    });
  }
};

// SOFT DELETE
export const remove = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Product not found",
      data: null,
    });
  }
};