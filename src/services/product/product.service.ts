import  prisma  from "../../lib/prisma.js";

interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  categoryId?: string;
}

// CREATE PRODUCT
export const createProduct = async (
  data: CreateProductData
) => {
  // Check category exists
  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
    },
  });

  return product;
};

// GET ALL PRODUCTS
export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
};

// GET PRODUCT BY ID
export const getProductById = async (
  id: string
) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

// UPDATE PRODUCT
export const updateProduct = async (
  id: string,
  data: UpdateProductData
) => {
  // Check product exists
  const product = await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // If categoryId is being updated,
  // check that category exists
  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        isDeleted: false,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data,
    include: {
      category: true,
    },
  });

  return updatedProduct;
};

// SOFT DELETE PRODUCT
export const deleteProduct = async (
  id: string
) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const deletedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return deletedProduct;
};