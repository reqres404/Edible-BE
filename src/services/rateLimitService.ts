import { logger } from '@/utils/logger';
import { OPEN_FOOD_FACTS_RATE_LIMITS } from '@/types/openFoodFacts';

interface RateLimitEntry {
  requests: number;
  resetTime: number;
}

/**
 * In-memory rate limiting service for OpenFoodFacts API calls
 * Prevents exceeding their rate limits:
 * - Product queries: 100 requests per minute
 * - Search queries: 10 requests per minute
 * - Facet queries: 2 requests per minute
 */
class RateLimitService {
  private productQueries: RateLimitEntry = { requests: 0, resetTime: 0 };
  private searchQueries: RateLimitEntry = { requests: 0, resetTime: 0 };
  private facetQueries: RateLimitEntry = { requests: 0, resetTime: 0 };

  /**
   * Check if a product query is allowed under rate limits
   */
  public canMakeProductQuery(): boolean {
    return this.canMakeRequest(
      this.productQueries,
      OPEN_FOOD_FACTS_RATE_LIMITS.productQueries
    );
  }

  /**
   * Check if a search query is allowed under rate limits
   */
  public canMakeSearchQuery(): boolean {
    return this.canMakeRequest(
      this.searchQueries,
      OPEN_FOOD_FACTS_RATE_LIMITS.searchQueries
    );
  }

  /**
   * Check if a facet query is allowed under rate limits
   */
  public canMakeFacetQuery(): boolean {
    return this.canMakeRequest(
      this.facetQueries,
      OPEN_FOOD_FACTS_RATE_LIMITS.facetQueries
    );
  }

  /**
   * Record a product query (call after making the request)
   */
  public recordProductQuery(): void {
    this.recordRequest(
      this.productQueries,
      OPEN_FOOD_FACTS_RATE_LIMITS.productQueries
    );
  }

  /**
   * Record a search query (call after making the request)
   */
  public recordSearchQuery(): void {
    this.recordRequest(
      this.searchQueries,
      OPEN_FOOD_FACTS_RATE_LIMITS.searchQueries
    );
  }

  /**
   * Record a facet query (call after making the request)
   */
  public recordFacetQuery(): void {
    this.recordRequest(
      this.facetQueries,
      OPEN_FOOD_FACTS_RATE_LIMITS.facetQueries
    );
  }

  /**
   * Get time until rate limit resets for product queries
   */
  public getProductQueryResetTime(): number {
    return Math.max(0, this.productQueries.resetTime - Date.now());
  }

  /**
   * Get time until rate limit resets for search queries
   */
  public getSearchQueryResetTime(): number {
    return Math.max(0, this.searchQueries.resetTime - Date.now());
  }

  /**
   * Get time until rate limit resets for facet queries
   */
  public getFacetQueryResetTime(): number {
    return Math.max(0, this.facetQueries.resetTime - Date.now());
  }

  /**
   * Get current rate limit status
   */
  public getRateLimitStatus() {
    const now = Date.now();
    
    return {
      productQueries: {
        remaining: Math.max(0, OPEN_FOOD_FACTS_RATE_LIMITS.productQueries.maxRequests - this.productQueries.requests),
        resetIn: Math.max(0, this.productQueries.resetTime - now),
        limit: OPEN_FOOD_FACTS_RATE_LIMITS.productQueries.maxRequests,
      },
      searchQueries: {
        remaining: Math.max(0, OPEN_FOOD_FACTS_RATE_LIMITS.searchQueries.maxRequests - this.searchQueries.requests),
        resetIn: Math.max(0, this.searchQueries.resetTime - now),
        limit: OPEN_FOOD_FACTS_RATE_LIMITS.searchQueries.maxRequests,
      },
      facetQueries: {
        remaining: Math.max(0, OPEN_FOOD_FACTS_RATE_LIMITS.facetQueries.maxRequests - this.facetQueries.requests),
        resetIn: Math.max(0, this.facetQueries.resetTime - now),
        limit: OPEN_FOOD_FACTS_RATE_LIMITS.facetQueries.maxRequests,
      },
    };
  }

  /**
   * Reset all rate limit counters (useful for testing)
   */
  public resetAllLimits(): void {
    this.productQueries = { requests: 0, resetTime: 0 };
    this.searchQueries = { requests: 0, resetTime: 0 };
    this.facetQueries = { requests: 0, resetTime: 0 };
    logger.info('All rate limits reset');
  }

  /**
   * Generic method to check if a request is allowed
   */
  private canMakeRequest(
    entry: RateLimitEntry,
    config: { maxRequests: number; windowMs: number }
  ): boolean {
    const now = Date.now();

    // Reset counter if window has passed
    if (now >= entry.resetTime) {
      entry.requests = 0;
      entry.resetTime = now + config.windowMs;
    }

    // Check if we're under the limit
    const canMake = entry.requests < config.maxRequests;
    
    if (!canMake) {
      logger.warn(`Rate limit exceeded. Requests: ${entry.requests}/${config.maxRequests}, Reset in: ${entry.resetTime - now}ms`);
    }

    return canMake;
  }

  /**
   * Generic method to record a request
   */
  private recordRequest(
    entry: RateLimitEntry,
    config: { maxRequests: number; windowMs: number }
  ): void {
    const now = Date.now();

    // Reset counter if window has passed
    if (now >= entry.resetTime) {
      entry.requests = 0;
      entry.resetTime = now + config.windowMs;
    }

    entry.requests++;
    
    logger.debug(`Request recorded. Current count: ${entry.requests}/${config.maxRequests}, Reset in: ${entry.resetTime - now}ms`);
  }
}

// Export singleton instance
export const rateLimitService = new RateLimitService();
