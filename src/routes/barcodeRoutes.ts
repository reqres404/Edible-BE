import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import { 
  getProductByBarcode, 
  searchProducts, 
  getRateLimitStatus, 
  healthCheck 
} from '@/controllers/barcodeController';

const router = Router();

/**
 * Barcode and product routes
 */

// Health check endpoint (no auth required)
router.get('/health', healthCheck);

// Get rate limit status (requires auth)
router.get('/rate-limits', authenticateUser, getRateLimitStatus);

// Get product by barcode (requires auth)
router.get('/product/:barcode', authenticateUser, getProductByBarcode);

// Search products (requires auth)
router.get('/search', authenticateUser, searchProducts);

export { router as barcodeRoutes };
