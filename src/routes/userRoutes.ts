import { Router } from 'express';
import { UserController } from '@/controllers/userController';
import { authenticateUser } from '@/middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateUser);

// Create or update user (POST for new, PUT for update)
router.post('/users', UserController.createOrUpdateUser);
router.put('/users', UserController.createOrUpdateUser);

// Get user by Google ID
router.get('/users/:googleId', UserController.getUserByGoogleId);

// Profile management
router.post('/users/:googleId/profiles', UserController.addProfile);
router.patch('/users/:googleId/profiles/:profileId', UserController.updateUserProfile);
router.delete('/users/:googleId/profiles/:profileId', UserController.deleteProfile);

// Add scanned barcode to user
router.post('/users/:googleId/scanned-codes', UserController.addScannedCode);

// Get user's scanned codes
router.get('/users/:googleId/scanned-codes', UserController.getScannedCodes);

// Delete user account
router.delete('/users/:googleId', UserController.deleteUser);

export default router;
