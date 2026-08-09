import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import { createToken } from "../../utils/jwt.js";


interface RegisterData {
  name: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Don't send password to client
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const loginUser = async (data: LoginData) => {
  const { email, password } = data;

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // 2. User doesn't exist
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 3. Check soft deleted user
  if (user.isDeleted) {
    throw new Error("This account has been deleted");
  }

  // 4. Compare password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  // 5. Create JWT
  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // 6. Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};