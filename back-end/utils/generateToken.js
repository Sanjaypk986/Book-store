import jwt from "jsonwebtoken";

export const generateToken = (email) => {
  if (!email) {
    throw new Error("Cannot generate token: invalid email");
  }

  // Generate token using JWT secret
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};
