import jwt from "jsonwebtoken";

export const signToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
  }

  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    sub: string;
  };
};
