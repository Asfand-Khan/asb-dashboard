import jwt from "jsonwebtoken";

export function getUserInfoFromToken(token: string) {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return user;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
