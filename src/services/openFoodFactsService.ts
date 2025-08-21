import axios from 'axios';
import { logger } from '@/utils/logger';
import { rateLimitService } from './rateLimitService';
import { 
  OpenFoodFactsResponse, 
  OpenFoodFactsSearchResponse, 
  SimplifiedProduct,
  OpenFoodFactsProduct 
} from '@/types/openFoodFacts';
import { createError } from '@/middleware/errorHandler';

/**
 * Service for interacting with OpenFoodFacts API
 * Handles rate limiting, caching, and data transformation
 */
class OpenFoodFactsService {
  private axiosInstance: any;
  private cache: Map<string, { data: SimplifiedProduct; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly BASE_URL = 'https://world.openfoodfacts.org';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 10000, // 10 seconds
      headers: {
        'User-Agent': 'Edible-App/1.0.0 (+https://github.com/reqres404/Edible) - Educational food scanning app',
        'Accept': 'application/json',
      },
    });

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response: any) => {
        logger.debug(`OpenFoodFacts API call successful: ${response.config.url}`);
        return response;
      },
      (error: any) => {
        logger.error(`OpenFoodFacts API call failed: ${error.config?.url}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get product by barcode with rate limiting and caching
   */
  public async getProductByBarcode(barcode: string): Promise<SimplifiedProduct> {
    // Validate barcode format
    const normalizedBarcode = this.normalizeBarcode(barcode);
    if (!this.isValidBarcode(normalizedBarcode)) {
      throw createError(`Invalid barcode format: ${barcode}`, 400);
    }

    // Check cache first
    const cached = this.getFromCache(normalizedBarcode);
    if (cached) {
      logger.debug(`Product found in cache: ${normalizedBarcode}`);
      return cached;
    }

    // Check rate limit
    if (!rateLimitService.canMakeProductQuery()) {
      const resetTime = rateLimitService.getProductQueryResetTime();
      throw createError(
        `Rate limit exceeded for product queries. Try again in ${Math.ceil(resetTime / 1000)} seconds.`,
        429
      );
    }

    try {
      // Make API call
      const url = `/api/v2/product/${normalizedBarcode}`;
      const fields = [
        'product_name',
        'brands',
        'image_front_url',
        'categories_tags',
        'ingredients_text',
        'allergens_tags',
        'nutrition_grades',
        'nova_group',
        'ecoscore_grade',
        'ecoscore_score',
        'nutriments',
        'nutriscore_data',
        'nutriscore_grade',
        'nutriscore_score'
      ].join(',');

      const response = await this.axiosInstance.get(
        `${url}?fields=${fields}`
      ) as { data: OpenFoodFactsResponse };

      // Record the API call for rate limiting
      rateLimitService.recordProductQuery();

      if (response.data.status === 0 || !response.data.product) {
        throw createError(`Product not found: ${normalizedBarcode}`, 404);
      }

      // Transform to simplified format
      const simplifiedProduct = this.transformProduct(response.data.product, normalizedBarcode);
      
      // Cache the result
      this.addToCache(normalizedBarcode, simplifiedProduct);
      
      logger.info(`Product retrieved successfully: ${normalizedBarcode}`);
      return simplifiedProduct;

    } catch (error: any) {
      if (error.response) {
        if (error.response?.status === 404) {
          throw createError(`Product not found: ${normalizedBarcode}`, 404);
        } else if (error.response?.status === 429) {
          throw createError('OpenFoodFacts API rate limit exceeded', 429);
        }
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw createError('Unable to connect to OpenFoodFacts API', 503);
      }
      
      logger.error(`Error fetching product ${normalizedBarcode}:`, error);
      throw createError('Failed to fetch product data', 500);
    }
  }

  /**
   * Search products (with higher rate limiting)
   */
  public async searchProducts(
    query: string, 
    page: number = 1, 
    pageSize: number = 20
  ): Promise<{ products: SimplifiedProduct[]; totalCount: number }> {
    // Check rate limit
    if (!rateLimitService.canMakeSearchQuery()) {
      const resetTime = rateLimitService.getSearchQueryResetTime();
      throw createError(
        `Rate limit exceeded for search queries. Try again in ${Math.ceil(resetTime / 1000)} seconds.`,
        429
      );
    }

    try {
      const response = await this.axiosInstance.get(
        `/api/v2/search?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`
      ) as { data: OpenFoodFactsSearchResponse };

      rateLimitService.recordSearchQuery();

      const products = response.data.products.map((product: any) => 
        this.transformProduct(product, product.code)
      );

      return {
        products,
        totalCount: response.data.count
      };

    } catch (error) {
      logger.error(`Error searching products with query "${query}":`, error);
      throw createError('Failed to search products', 500);
    }
  }

  /**
   * Get rate limit status
   */
  public getRateLimitStatus() {
    return rateLimitService.getRateLimitStatus();
  }

  /**
   * Clear cache (useful for testing)
   */
  public clearCache(): void {
    this.cache.clear();
    logger.info('OpenFoodFacts cache cleared');
  }

  /**
   * Normalize barcode format
   */
  private normalizeBarcode(barcode: string): string {
    // Remove any non-digit characters
    const cleaned = barcode.replace(/\D/g, '');
    
    // Pad shorter barcodes
    if (cleaned.length <= 7) {
      return cleaned.padStart(8, '0');
    } else if (cleaned.length >= 9 && cleaned.length <= 12) {
      return cleaned.padStart(13, '0');
    }
    
    return cleaned;
  }

  /**
   * Validate barcode format
   */
  private isValidBarcode(barcode: string): boolean {
    // Must be numeric
    if (!/^\d+$/.test(barcode)) {
      return false;
    }

    // Must be a valid length
    const validLengths = [8, 12, 13, 14]; // Common barcode lengths
    return validLengths.includes(barcode.length);
  }

  /**
   * Check cache for product
   */
  private getFromCache(barcode: string): SimplifiedProduct | null {
    const cached = this.cache.get(barcode);
    if (!cached) {
      return null;
    }

    // Check if cache entry is expired
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(barcode);
      return null;
    }

    return cached.data;
  }

  /**
   * Add product to cache
   */
  private addToCache(barcode: string, product: SimplifiedProduct): void {
    this.cache.set(barcode, {
      data: product,
      timestamp: Date.now()
    });

    // Clean up old cache entries periodically
    if (this.cache.size > 1000) {
      this.cleanupCache();
    }
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    logger.debug(`Cache cleanup: removed ${removedCount} expired entries`);
  }

  /**
   * Transform OpenFoodFacts product to our simplified format
   */
  private transformProduct(product: OpenFoodFactsProduct, barcode: string): SimplifiedProduct {
    const result: SimplifiedProduct = {
      barcode,
    };

    if (product.product_name) result.name = product.product_name;
    if (product.brands) result.brand = product.brands.split(',')[0]?.trim();
    if (product.image_front_url) result.imageUrl = product.image_front_url;
    if (product.categories_tags) {
      result.categories = product.categories_tags.map(tag => 
        tag.replace(/^en:/, '').replace(/-/g, ' ')
      );
    }
    if (product.ingredients_text) result.ingredients = product.ingredients_text;
    if (product.allergens_tags) {
      result.allergens = product.allergens_tags.map(tag => 
        tag.replace(/^en:/, '').replace(/-/g, ' ')
      );
    }
    if (product.nutrition_grades) result.nutritionGrade = product.nutrition_grades;
    if (product.nova_group !== undefined) result.novaGroup = product.nova_group;

    if (product.ecoscore_grade || product.ecoscore_score) {
      result.ecoscore = {};
      if (product.ecoscore_grade) result.ecoscore.grade = product.ecoscore_grade;
      if (product.ecoscore_score !== undefined) result.ecoscore.score = product.ecoscore_score;
    }

    if (product.nutriments) {
      const nutriments: any = {};
      if (product.nutriments['energy-kcal_100g'] !== undefined) nutriments.energy_kcal_100g = product.nutriments['energy-kcal_100g'];
      if (product.nutriments.proteins_100g !== undefined) nutriments.proteins_100g = product.nutriments.proteins_100g;
      if (product.nutriments.carbohydrates_100g !== undefined) nutriments.carbohydrates_100g = product.nutriments.carbohydrates_100g;
      if (product.nutriments.fat_100g !== undefined) nutriments.fat_100g = product.nutriments.fat_100g;
      if (product.nutriments.fiber_100g !== undefined) nutriments.fiber_100g = product.nutriments.fiber_100g;
      if (product.nutriments.sugars_100g !== undefined) nutriments.sugars_100g = product.nutriments.sugars_100g;
      if (product.nutriments.salt_100g !== undefined) nutriments.salt_100g = product.nutriments.salt_100g;
      if (product.nutriments.sodium_100g !== undefined) nutriments.sodium_100g = product.nutriments.sodium_100g;
      
      if (Object.keys(nutriments).length > 0) {
        result.nutriments = nutriments;
      }
    }

    if (product.nutriscore_grade || product.nutrition_grades || product.nutriscore_data?.score !== undefined) {
      result.nutriscore = {};
      if (product.nutriscore_grade) {
        result.nutriscore.grade = product.nutriscore_grade;
      } else if (product.nutrition_grades) {
        result.nutriscore.grade = product.nutrition_grades;
      }
      if (product.nutriscore_data?.score !== undefined) {
        result.nutriscore.score = product.nutriscore_data.score;
      }
    }

    return result;
  }
}

// Export singleton instance
export const openFoodFactsService = new OpenFoodFactsService();
