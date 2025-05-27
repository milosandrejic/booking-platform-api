import jwt from "jsonwebtoken";

const SERVICE_SECRET = process.env.SERVICE_JWT_SECRET as string;

export function issueServiceToken(serviceName: string): string {
  return jwt.sign({ service: serviceName }, SERVICE_SECRET, { expiresIn: "1m" });
}

export function verifyServiceToken(token: string): { service: string } {
  return jwt.verify(token, SERVICE_SECRET) as { service: string };
}
