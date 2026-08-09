import type { Request, Response } from "express";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "./order.service.js";

// CREATE
export const create = async (
  req: Request,
  res: Response
) => {
  try {
    const order = await createOrder(req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create order",
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
    const orders = await getAllOrders();

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
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
      message: "Invalid order id",
      data: null,
    });
  }

  try {
    const order = await getOrderById(id);

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Order not found",
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
      message: "Invalid order id",
      data: null,
    });
  }

  try {
    const order = await updateOrder(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update order",
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
      message: "Invalid order id",
      data: null,
    });
  }

  try {
    await deleteOrder(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Order not found",
      data: null,
    });
  }
};
