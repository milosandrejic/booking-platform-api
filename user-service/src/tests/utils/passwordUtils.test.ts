import { describe, expect, it } from "@jest/globals";
import { PasswordUtils } from "src/utils/passwordUtils";

describe("PasswordUtils", () => {
  describe("hash", () => {
    it("should hash a password", async () => {
      const plainPassword = "password123";
      const hashedPassword = await PasswordUtils.hash(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.startsWith("$2b$")).toBe(true);
    });

    it("should generate different hashes for the same password", async () => {
      const plainPassword = "password123";
      const hash1 = await PasswordUtils.hash(plainPassword);
      const hash2 = await PasswordUtils.hash(plainPassword);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("compare", () => {
    it("should return true for matching password and hash", async () => {
      const plainPassword = "password123";
      const hashedPassword = await PasswordUtils.hash(plainPassword);

      const result = await PasswordUtils.compare(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it("should return false for non-matching password and hash", async () => {
      const plainPassword = "password123";
      const wrongPassword = "wrongpassword";
      const hashedPassword = await PasswordUtils.hash(plainPassword);

      const result = await PasswordUtils.compare(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });
  });
});
