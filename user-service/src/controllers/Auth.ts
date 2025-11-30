import { Request, Response } from "express";

import { authRepository } from "src/repositories";
import { PasswordUtils } from "src/utils/passwordUtils";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "src/utils/jwt";

class AuthController {
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const auth = await authRepository.findOneBy({ email });

    if (!auth) {
      res.status(400).send({
        error: `User with email ${email} does no exists`
      });

      return;
    }

    const passwordsMatch = await PasswordUtils.compare(password, auth.password);

    if (!passwordsMatch) {
      res.status(400).send({
        error: "Wrong email or password"
      });

      return;
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(auth.id, auth.email, auth.role);
    const refreshToken = generateRefreshToken(auth.id, auth.tokenVersion);

    // Hash and store refresh token in database
    const hashedRefreshToken = await PasswordUtils.hash(refreshToken);
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days

    await authRepository.saveRefreshToken(
      auth.id,
      hashedRefreshToken,
      refreshTokenExpiry
    );

    // Set httpOnly sameSite cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: "/api/v1"
    });

    res.send({
      accessToken,
      refreshToken
    });
  };

  static refresh = async (req: Request, res: Response) => {
    // Get refresh token from cookie (priority) or body (fallback)
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).send({
        error: "Refresh token is required"
      });

      return;
    }

    try {
      // Verify and decode refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Find user and validate token version
      const auth = await authRepository.findOneBy({ id: decoded.id });

      if (!auth) {
        res.status(401).send({
          error: "User not found"
        });

        return;
      }

      // Verify token version matches (for revocation)
      if (auth.tokenVersion !== decoded.tokenVersion) {
        res.status(401).send({
          error: "Token has been revoked"
        });

        return;
      }

      // Verify stored refresh token matches
      if (!auth.refreshToken) {
        res.status(401).send({
          error: "No active refresh token"
        });

        return;
      }

      const tokenMatches = await PasswordUtils.compare(
        refreshToken,
        auth.refreshToken
      );

      if (!tokenMatches) {
        res.status(401).send({
          error: "Invalid refresh token"
        });

        return;
      }

      // Check if token is expired
      if (auth.refreshTokenExpiry && auth.refreshTokenExpiry < new Date()) {
        res.status(401).send({
          error: "Refresh token has expired"
        });

        return;
      }

      // Generate new token pair (strict rotation)
      const newAccessToken = generateAccessToken(auth.id, auth.email, auth.role);
      const newRefreshToken = generateRefreshToken(auth.id, auth.tokenVersion);

      // Hash and store new refresh token
      const hashedRefreshToken = await PasswordUtils.hash(newRefreshToken);
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

      await authRepository.saveRefreshToken(
        auth.id,
        hashedRefreshToken,
        refreshTokenExpiry
      );

      // Update cookie with new refresh token
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/api/v1"
      });

      res.send({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch {
      res.status(401).send({
        error: "Invalid or expired refresh token"
      });
    }
  };

  static logout = async (req: Request, res: Response) => {
    try {
      const userId = req.auth.id;

      // Increment token version to invalidate all existing refresh tokens
      await authRepository.incrementTokenVersion(userId);

      // Clear refresh token from database
      await authRepository.clearRefreshToken(userId);

      // Clear refresh token cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/v1"
      });

      res.send({ message: "Logged out successfully" });
    } catch {
      res.status(500).send({
        error: "Failed to logout"
      });
    }
  };

  static internalAuth = async (req: Request, res: Response) => {
    res.send({
      id: req.auth.id
    });
  };
}

export default AuthController;
