import type { Request, Response } from "express";

import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "./category.service.js";

// CREATE
export const create = async (
    req: Request,
    res: Response
) => {
    try {
        const category = await createCategory(req.body.name);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
};

// GET ALL
export const getAll = async (
    req: Request,
    res: Response
) => {
    try {
        const categories = await getAllCategories();

        res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve categories",
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
            message: "Invalid category id",
        });
    }

    try {
        const category = await getCategoryById(id);

        res.status(200).json({
            success: true,
            message: "Category retrieved successfully",
            data: category,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Category not found",
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
            message: "Invalid category id",
        });
    }

    try {
        const category = await updateCategory(
            id,
            req.body.name
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Category not found",
        });
    }
};

// DELETE
export const remove = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid category id",
        });
    }

    try {
        await deleteCategory(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: null,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Category not found",
        });
    }
};