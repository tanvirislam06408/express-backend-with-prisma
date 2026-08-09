interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (
  data: unknown
): RegisterInput => {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid request body");
  }

  const { name, email, password } = data as Record<string, unknown>;

  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Name is required");
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    throw new Error("A valid email is required");
  }

  if (typeof password !== "string" || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  };
};

export const validateLogin = (data: unknown): LoginInput => {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid request body");
  }

  const { email, password } = data as Record<string, unknown>;

  if (typeof email !== "string" || email.trim() === "") {
    throw new Error("Email is required");
  }

  if (typeof password !== "string" || password.trim() === "") {
    throw new Error("Password is required");
  }

  return {
    email: email.trim().toLowerCase(),
    password,
  };
};
