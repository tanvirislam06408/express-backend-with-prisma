import prisma from "../../lib/prisma.js";


// CREATE
export const createCategory = async (name: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory && !existingCategory.isDeleted) {
    throw new Error("Category already exists");
  }

  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  return category;
};

// GET ALL
export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

// GET BY ID
export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

// UPDATE
export const updateCategory = async (
  id: string,
  name: string
) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return updatedCategory;
};

// SOFT DELETE
export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const deletedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return deletedCategory;
};