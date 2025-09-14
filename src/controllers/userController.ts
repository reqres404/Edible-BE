import { Request, Response } from 'express';
import { User } from '@/models/User';
import { logger } from '@/utils/logger';
import { createError } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

export class UserController {
  /**
   * Create or update user from Google authentication
   */
  static async createOrUpdateUser(req: AuthenticatedRequest, res: Response) {
    try {
      // Get user data from authenticated request
      if (!req.user) {
        throw createError('User not authenticated', 401);
      }

      const { id: googleId, email, name, picture } = req.user;
      const { profiles } = req.body;

      // Check if user already exists
      let user = await User.findOne({ googleId });

      if (user) {
        // Update existing user
        user.name = name;
        if (picture !== undefined) user.picture = picture;
        if (profiles !== undefined) user.profiles = profiles;
        
        await user.save();
        logger.info(`User updated: ${email}`);
      } else {
        // Create new user with default profile
        const defaultProfile = {
          name: name,
          age: undefined,
          conditions: [],
          lifestyle: undefined,
        };
        
                 user = new User({
           googleId,
           email,
           name,
           ...(picture && { picture }),
           profiles: [defaultProfile],
           scannedCodes: [],
         });
        
        await user.save();
        logger.info(`New user created: ${email}`);
      }

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            googleId: user.googleId,
            email: user.email,
            name: user.name,
            picture: user.picture,
            profiles: user.profiles,
            scannedCodes: user.scannedCodes,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        }
      });
    } catch (error: any) {
      logger.error('Error in createOrUpdateUser:', error);
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Get user by Google ID
   */
  static async getUserByGoogleId(req: Request, res: Response) {
    try {
      const { googleId } = req.params;

      if (!googleId) {
        throw createError('Google ID is required', 400);
      }

      const user = await User.findOne({ googleId });

      if (!user) {
        throw createError('User not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            googleId: user.googleId,
            email: user.email,
            name: user.name,
            picture: user.picture,
            profiles: user.profiles,
            scannedCodes: user.scannedCodes,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        }
      });
    } catch (error: any) {
      logger.error('Error in getUserByGoogleId:', error);
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(req: Request, res: Response) {
    try {
      const { googleId } = req.params;
      const { profileId, updates } = req.body;

      if (!googleId) {
        throw createError('Google ID is required', 400);
      }

      if (!profileId) {
        throw createError('Profile ID is required', 400);
      }

      const user = await User.findOne({ googleId });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Find the profile to update
      const profile = user.profiles.find(p => p._id?.toString() === profileId);
      if (!profile) {
        throw createError('Profile not found', 404);
      }

      // Update profile fields
      if (updates.name !== undefined) profile.name = updates.name;
      if (updates.age !== undefined) profile.age = updates.age;
      // Support both 'allergens' and 'conditions' for backward compatibility
      if (updates.allergens !== undefined) profile.conditions = updates.allergens;
      if (updates.conditions !== undefined) profile.conditions = updates.conditions;
      if (updates.lifestyle !== undefined) profile.lifestyle = updates.lifestyle;

      await user.save();

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            googleId: user.googleId,
            email: user.email,
            name: user.name,
            picture: user.picture,
            profiles: user.profiles,
            scannedCodes: user.scannedCodes,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        }
      });
    } catch (error: any) {
      logger.error('Error in updateUserProfile:', error);
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Add scanned barcode to user
   */
  static async addScannedCode(req: Request, res: Response) {
    try {
      const { googleId } = req.params;
      const { barcode } = req.body;

      if (!googleId || !barcode) {
        throw createError('Google ID and barcode are required', 400);
      }

      const user = await User.findOne({ googleId });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Add barcode if not already present
      if (!user.scannedCodes.includes(barcode)) {
        user.scannedCodes.push(barcode);
        await user.save();
        logger.info(`Barcode ${barcode} added to user ${user.email}`);
      }

      res.status(200).json({
        status: 'success',
        data: {
          scannedCodes: user.scannedCodes
        }
      });
    } catch (error: any) {
      logger.error('Error in addScannedCode:', error);
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Get user's scanned codes
   */
  static async getScannedCodes(req: Request, res: Response) {
    try {
      const { googleId } = req.params;

      if (!googleId) {
        throw createError('Google ID is required', 400);
      }

      const user = await User.findOne({ googleId });

      if (!user) {
        throw createError('User not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: {
          scannedCodes: user.scannedCodes
        }
      });
    } catch (error: any) {
      logger.error('Error in getScannedCodes:', error);
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Add new profile to user
   */
  static async addProfile(req: Request, res: Response) {
    try {
      const { googleId } = req.params;
      const { name, age, conditions, allergens, lifestyle } = req.body;

      // Debug logging
      logger.info('Add Profile Request:', {
        googleId,
        body: req.body,
        name,
        age,
        conditions,
        allergens,
        lifestyle
      });

      if (!googleId || !name) {
        throw createError('Google ID and name are required', 400);
      }

      const user = await User.findOne({ googleId });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Support both 'allergens' and 'conditions' for backward compatibility
      const profileConditions = allergens || conditions || [];

      // Create new profile
      const newProfile = {
        name,
        age,
        conditions: profileConditions,
        lifestyle,
      };

      user.profiles.push(newProfile);
      await user.save();

      logger.info(`New profile added for user: ${user.email}`, {
        profileName: name,
        conditions: profileConditions,
        age,
        lifestyle
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            googleId: user.googleId,
            email: user.email,
            name: user.name,
            picture: user.picture,
            profiles: user.profiles,
            scannedCodes: user.scannedCodes,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        }
      });
    } catch (error: any) {
      logger.error('Error in addProfile:', error);
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Delete profile from user
   */
  static async deleteProfile(req: Request, res: Response) {
    try {
      const { googleId, profileId } = req.params;

      if (!googleId || !profileId) {
        throw createError('Google ID and profile ID are required', 400);
      }

      const user = await User.findOne({ googleId });

      if (!user) {
        throw createError('User not found', 404);
      }

      // Find and remove profile
      const profileIndex = user.profiles.findIndex(p => p._id?.toString() === profileId);
      if (profileIndex === -1) {
        throw createError('Profile not found', 404);
      }

      // Don't allow deleting the last profile
      if (user.profiles.length <= 1) {
        throw createError('Cannot delete the last profile', 400);
      }

      user.profiles.splice(profileIndex, 1);
      await user.save();

      logger.info(`Profile deleted for user: ${user.email}`);

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            googleId: user.googleId,
            email: user.email,
            name: user.name,
            picture: user.picture,
            profiles: user.profiles,
            scannedCodes: user.scannedCodes,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        }
      });
    } catch (error: any) {
      logger.error('Error in deleteProfile:', error);
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Delete user account
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      const { googleId } = req.params;

      if (!googleId) {
        throw createError('Google ID is required', 400);
      }

      const user = await User.findOneAndDelete({ googleId });

      if (!user) {
        throw createError('User not found', 404);
      }

      logger.info(`User deleted: ${user.email}`);

      res.status(200).json({
        status: 'success',
        message: 'User account deleted successfully'
      });
    } catch (error: any) {
      logger.error('Error in deleteUser:', error);
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Internal server error'
      });
    }
  }
}
