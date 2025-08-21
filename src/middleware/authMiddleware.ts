import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { config } from '@/config/config';
import { createError } from './errorHandler';
import { logger } from '@/utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

// Google OAuth2 client for token verification
const googleClient = new OAuth2Client();

/**
 * Middleware to authenticate users via Google JWT tokens
 * Supports both Google ID tokens and our own JWT tokens which does not exist yet as I am not competent enough
 */
export const authenticateUser = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Access token required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Try to verify as Google ID token first
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID || config.google.clientId,
      });
      
      const payload = (await ticket).getPayload();
      if (!payload) {
        throw createError('Invalid Google token payload', 401);
      }

      req.user = {
        id: payload.sub,
        email: payload.email!,
        name: payload.name!,
        ...(payload.picture && { picture: payload.picture }),
      };

      logger.info(`User authenticated via Google: ${req.user?.email}`);
      next();
      return;
    } catch (googleError) {
      // If Google verification fails, try our own JWT
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as any;
        
        req.user = {
          id: decoded.sub || decoded.id,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        };

        logger.info(`User authenticated via JWT: ${req.user.email}`);
        next();
        return;
      } catch (jwtError) {
        logger.warn('Token verification failed', { 
          googleError: googleError instanceof Error ? googleError.message : 'Unknown error',
          jwtError: jwtError instanceof Error ? jwtError.message : 'Unknown error'
        });
        throw createError('Invalid or expired token', 401);
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication middleware - doesn't throw error if no token
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authenticateUser(req, res, next);
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Generate our own JWT token for a user (useful for session management)
 */
export const generateJWT = (user: { id: string; email: string; name: string; picture?: string }): string => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
      issuer: 'edible-api',
      audience: 'edible-app',
    } as jwt.SignOptions
  );
};
