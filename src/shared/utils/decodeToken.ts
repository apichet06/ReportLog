import jwt from "jsonwebtoken";

export function DecodeToken(token: string): object | null {
  try {
    const decoded = jwt.decode(token);
    return decoded as object | null;
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("เกิดข้อผิดพลาดในการถอดรหัส token:", error.message);

    return null;
  }
}
