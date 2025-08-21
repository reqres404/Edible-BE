import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';
import { openFoodFactsService } from '@/services/openFoodFactsService';
import { logger } from '@/utils/logger';
import { createError } from '@/middleware/errorHandler';
import { ApiResponse } from '@/types';
import { SimplifiedProduct } from '@/types/openFoodFacts';

export const getProductByBarcode = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }

    const { barcode } = req.params;

    // Validate barcode parameter
    if (!barcode) {
      throw createError('Barcode parameter is required', 400);
    }

    logger.info(`Product lookup requested by user ${req.user.email} for barcode: ${barcode}`);

    const product = await openFoodFactsService.getProductByBarcode(barcode);

    // Prepare successful response
    const response: ApiResponse<SimplifiedProduct> = {
      status: 'success',
      message: 'Product found successfully',
      data: product,
      timestamp: new Date().toISOString(),
    };

    // Log successful lookup
    logger.info(`Product found for barcode ${barcode}: ${product.name || 'Unknown name'}`);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    if (!req.user) {
      throw createError('Authentication required', 401);
    }

    const { q: query, page = '1', limit = '20' } = req.query;

    // Validate query parameter
    if (!query || typeof query !== 'string') {
      throw createError('Query parameter is required', 400);
    }

    // Validate pagination parameters
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      throw createError('Invalid page parameter', 400);
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw createError('Invalid limit parameter (must be between 1 and 100)', 400);
    }

    // Log the request
    logger.info(`Product search requested by user ${req.user.email} for query: "${query}"`);

    // Search products
    const searchResults = await openFoodFactsService.searchProducts(query, pageNum, limitNum);

    // Prepare successful response
    const response: ApiResponse<SimplifiedProduct[]> = {
      status: 'success',
      message: `Found ${searchResults.totalCount} products`,
      data: searchResults.products,
      timestamp: new Date().toISOString(),
    };

    // Add pagination info to response
    (response as any).pagination = {
      page: pageNum,
      limit: limitNum,
      total: searchResults.totalCount,
      totalPages: Math.ceil(searchResults.totalCount / limitNum),
    };

    // Log successful search
    logger.info(`Product search completed for query "${query}": ${searchResults.products.length} results returned`);

    res.status(200).json(response);
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
};

/**
 * Get rate limit status for OpenFoodFacts API
 * Requires user authentication
 */
export const getRateLimitStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      throw createError('Authentication required', 401);
    }

    // Get rate limit status
    const rateLimitStatus = openFoodFactsService.getRateLimitStatus();

    // Prepare successful response
    const response: ApiResponse<typeof rateLimitStatus> = {
      status: 'success',
      message: 'Rate limit status retrieved successfully',
      data: rateLimitStatus,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
};

/**
 * Health check endpoint for barcode service
 * No authentication required
 */
export const healthCheck = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if OpenFoodFacts service is reachable
    const rateLimitStatus = openFoodFactsService.getRateLimitStatus();
    
    const response: ApiResponse<{ 
      service: string; 
      rateLimits: typeof rateLimitStatus 
    }> = {
      status: 'success',
      message: 'Barcode service is healthy',
      data: {
        service: 'OpenFoodFacts',
        rateLimits: rateLimitStatus,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
};
