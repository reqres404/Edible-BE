/**
 * OpenFoodFacts API response types and interfaces
 * Based on the OpenFoodFacts API v2 documentation
 */

export interface OpenFoodFactsProduct {
  _id?: string;
  _keywords?: string[];
  added_countries_tags?: string[];
  additives_tags?: string[];
  allergens?: string;
  allergens_from_ingredients?: string;
  allergens_from_user?: string;
  allergens_hierarchy?: string[];
  allergens_tags?: string[];
  brands?: string;
  brands_tags?: string[];
  categories?: string;
  categories_hierarchy?: string[];
  categories_tags?: string[];
  code: string;
  countries?: string;
  countries_hierarchy?: string[];
  countries_tags?: string[];
  created_t?: number;
  creator?: string;
  ecoscore_data?: EcoscoreData;
  ecoscore_grade?: string;
  ecoscore_score?: number;
  ecoscore_tags?: string[];
  emb_codes?: string;
  emb_codes_tags?: string[];
  energy_kcal_100g?: number;
  energy_kj_100g?: number;
  generic_name?: string;
  id?: string;
  image_front_small_url?: string;
  image_front_thumb_url?: string;
  image_front_url?: string;
  image_ingredients_small_url?: string;
  image_ingredients_thumb_url?: string;
  image_ingredients_url?: string;
  image_nutrition_small_url?: string;
  image_nutrition_thumb_url?: string;
  image_nutrition_url?: string;
  image_small_url?: string;
  image_thumb_url?: string;
  image_url?: string;
  ingredients?: Ingredient[];
  ingredients_analysis_tags?: string[];
  ingredients_from_or_that_may_be_from_palm_oil_tags?: string[];
  ingredients_from_palm_oil_tags?: string[];
  ingredients_hierarchy?: string[];
  ingredients_n?: number;
  ingredients_n_tags?: string[];
  ingredients_original_tags?: string[];
  ingredients_percent_analysis?: number;
  ingredients_tags?: string[];
  ingredients_text?: string;
  ingredients_text_with_allergens?: string;
  ingredients_that_may_be_from_palm_oil_tags?: string[];
  known_ingredients_n?: number;
  labels?: string;
  labels_hierarchy?: string[];
  labels_tags?: string[];
  lang?: string;
  languages?: Languages;
  languages_codes?: LanguagesCodes;
  languages_hierarchy?: string[];
  languages_tags?: string[];
  last_edit_dates_tags?: string[];
  last_editor?: string;
  last_image_dates_tags?: string[];
  last_image_t?: number;
  last_modified_by?: string;
  last_modified_t?: number;
  lc?: string;
  link?: string;
  main_countries_tags?: string[];
  manufacturing_places?: string;
  manufacturing_places_tags?: string[];
  max_imgid?: string;
  misc_tags?: string[];
  nova_group?: number;
  nova_group_debug?: string;
  nova_groups?: string;
  nova_groups_tags?: string[];
  nucleotides_tags?: string[];
  nutrient_levels?: NutrientLevels;
  nutrient_levels_tags?: string[];
  nutriments?: Nutriments;
  nutriscore_data?: NutriscoreData;
  nutriscore_grade?: string;
  nutriscore_score?: number;
  nutriscore_version?: string;
  nutrition_data?: string;
  nutrition_data_per?: string;
  nutrition_data_prepared?: string;
  nutrition_data_prepared_per?: string;
  nutrition_grade_fr?: string;
  nutrition_grades?: string;
  nutrition_grades_tags?: string[];
  nutrition_score_beverage?: number;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients?: number;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value?: number;
  origins?: string;
  origins_hierarchy?: string[];
  origins_tags?: string[];
  other_nutritional_substances_tags?: string[];
  packaging?: string;
  packaging_hierarchy?: string[];
  packaging_tags?: string[];
  packagings?: Packaging[];
  photographers_tags?: string[];
  pnns_groups_1?: string;
  pnns_groups_1_tags?: string[];
  pnns_groups_2?: string;
  pnns_groups_2_tags?: string[];
  popularity_key?: number;
  popularity_tags?: string[];
  product_name?: string;
  product_name_en?: string;
  product_name_fr?: string;
  purchase_places?: string;
  purchase_places_tags?: string[];
  quantity?: string;
  removed_countries_tags?: string[];
  rev?: number;
  scans_n?: number;
  selected_images?: SelectedImages;
  serving_quantity?: string;
  serving_size?: string;
  states?: string;
  states_hierarchy?: string[];
  states_tags?: string[];
  stores?: string;
  stores_tags?: string[];
  traces?: string;
  traces_from_ingredients?: string;
  traces_from_user?: string;
  traces_hierarchy?: string[];
  traces_tags?: string[];
  unique_scans_n?: number;
  unknown_ingredients_n?: number;
  unknown_nutrients_tags?: string[];
  update_key?: string;
  url?: string;
  vitamins_tags?: string[];
}

export interface EcoscoreData {
  adjustments?: {
    origins_of_ingredients?: {
      aggregated_origins?: Array<{
        origin: string;
        percent: number;
      }>;
      epi_score: number;
      epi_value: number;
      origins_from_origins_field?: string[];
      transportation_scores?: {
        [key: string]: number;
      };
      transportation_values?: {
        [key: string]: number;
      };
      value: number;
      values?: {
        [key: string]: number;
      };
    };
    packaging?: {
      non_recyclable_and_non_biodegradable_materials: number;
      packagings?: Array<{
        ecoscore_material_score: number;
        ecoscore_shape_ratio: number;
        material: string;
        shape: string;
      }>;
      score: number;
      value: number;
    };
    production_system?: {
      labels?: string[];
      value: number;
      warning: string;
    };
    threatened_species?: {
      ingredient: string;
      value: number;
    };
  };
  agribalyse?: {
    agribalyse_food_code: string;
    co2_agriculture: number;
    co2_consumption: number;
    co2_distribution: number;
    co2_packaging: number;
    co2_processing: number;
    co2_total: number;
    co2_transportation: number;
    code: string;
    dqr: string;
    ef_agriculture: number;
    ef_consumption: number;
    ef_distribution: number;
    ef_packaging: number;
    ef_processing: number;
    ef_total: number;
    ef_transportation: number;
    is_beverage: number;
    name_en: string;
    name_fr: string;
    score: number;
  };
  grade: string;
  grades: {
    [countryCode: string]: string;
  };
  missing?: {
    labels: number;
    origins: number;
    packagings: number;
  };
  missing_data_warning: number;
  previous_data?: {
    agribalyse: {
      grade: string;
      score: number;
    };
    grade: string;
    score: number;
  };
  score: number;
  scores?: {
    [countryCode: string]: number;
  };
  status: string;
}

export interface Ingredient {
  id?: string;
  percent?: number;
  percent_estimate?: number;
  percent_max?: number;
  percent_min?: number;
  rank?: number;
  text?: string;
  vegan?: string;
  vegetarian?: string;
}

export interface Languages {
  'en:english'?: number;
  'fr:français'?: number;
}

export interface LanguagesCodes {
  en?: number;
  fr?: number;
}

export interface NutrientLevels {
  fat?: string;
  salt?: string;
  'saturated-fat'?: string;
  sugars?: string;
}

export interface Nutriments {
  carbohydrates?: number;
  carbohydrates_100g?: number;
  carbohydrates_serving?: number;
  carbohydrates_unit?: string;
  carbohydrates_value?: number;
  energy?: number;
  'energy-kcal'?: number;
  'energy-kcal_100g'?: number;
  'energy-kcal_serving'?: number;
  'energy-kcal_unit'?: string;
  'energy-kcal_value'?: number;
  'energy-kj'?: number;
  'energy-kj_100g'?: number;
  'energy-kj_serving'?: number;
  'energy-kj_unit'?: string;
  'energy-kj_value'?: number;
  energy_100g?: number;
  energy_serving?: number;
  energy_unit?: string;
  energy_value?: number;
  fat?: number;
  fat_100g?: number;
  fat_serving?: number;
  fat_unit?: string;
  fat_value?: number;
  fiber?: number;
  fiber_100g?: number;
  fiber_serving?: number;
  fiber_unit?: string;
  fiber_value?: number;
  'fruits-vegetables-nuts-estimate-from-ingredients_100g'?: number;
  'nova-group'?: number;
  'nova-group_100g'?: number;
  'nova-group_serving'?: number;
  'nutrition-score-fr'?: number;
  'nutrition-score-fr_100g'?: number;
  proteins?: number;
  proteins_100g?: number;
  proteins_serving?: number;
  proteins_unit?: string;
  proteins_value?: number;
  salt?: number;
  salt_100g?: number;
  salt_serving?: number;
  salt_unit?: string;
  salt_value?: number;
  'saturated-fat'?: number;
  'saturated-fat_100g'?: number;
  'saturated-fat_serving'?: number;
  'saturated-fat_unit'?: string;
  'saturated-fat_value'?: number;
  sodium?: number;
  sodium_100g?: number;
  sodium_serving?: number;
  sodium_unit?: string;
  sodium_value?: number;
  sugars?: number;
  sugars_100g?: number;
  sugars_serving?: number;
  sugars_unit?: string;
  sugars_value?: number;
}

export interface NutriscoreData {
  energy?: number;
  energy_points?: number;
  energy_value?: number;
  fiber?: number;
  fiber_points?: number;
  fiber_value?: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils?: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_points?: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_value?: number;
  grade?: string;
  is_beverage?: number;
  is_cheese?: number;
  is_fat?: number;
  is_water?: number;
  negative_points?: number;
  positive_points?: number;
  proteins?: number;
  proteins_points?: number;
  proteins_value?: number;
  saturated_fat?: number;
  saturated_fat_points?: number;
  saturated_fat_ratio?: number;
  saturated_fat_ratio_points?: number;
  saturated_fat_ratio_value?: number;
  saturated_fat_value?: number;
  score?: number;
  sodium?: number;
  sodium_points?: number;
  sodium_value?: number;
  sugars?: number;
  sugars_points?: number;
  sugars_value?: number;
}

export interface Packaging {
  material?: string;
  shape?: string;
}

export interface SelectedImages {
  front?: {
    display?: {
      en?: string;
      fr?: string;
    };
    small?: {
      en?: string;
      fr?: string;
    };
    thumb?: {
      en?: string;
      fr?: string;
    };
  };
  ingredients?: {
    display?: {
      en?: string;
      fr?: string;
    };
    small?: {
      en?: string;
      fr?: string;
    };
    thumb?: {
      en?: string;
      fr?: string;
    };
  };
  nutrition?: {
    display?: {
      en?: string;
      fr?: string;
    };
    small?: {
      en?: string;
      fr?: string;
    };
    thumb?: {
      en?: string;
      fr?: string;
    };
  };
}

export interface OpenFoodFactsResponse {
  code: string;
  product?: OpenFoodFactsProduct;
  status: number;
  status_verbose: string;
}

export interface OpenFoodFactsSearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: OpenFoodFactsProduct[];
  skip: number;
}

/**
 * Simplified product interface for our API responses
 */
export interface SimplifiedProduct {
  barcode: string;
  name?: string;
  brand?: string;
  imageUrl?: string;
  categories?: string[];
  ingredients?: string;
  allergens?: string[];
  nutritionGrade?: string;
  novaGroup?: number;
  ecoscore?: {
    grade?: string;
    score?: number;
  };
  nutriments?: {
    energy_kcal_100g?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    salt_100g?: number;
    sodium_100g?: number;
  };
  nutriscore?: {
    grade?: string;
    score?: number;
  };
}

/**
 * Rate limiting configuration for OpenFoodFacts API
 */
export interface RateLimitConfig {
  productQueries: {
    maxRequests: number;
    windowMs: number;
  };
  searchQueries: {
    maxRequests: number;
    windowMs: number;
  };
  facetQueries: {
    maxRequests: number;
    windowMs: number;
  };
}

export const OPEN_FOOD_FACTS_RATE_LIMITS: RateLimitConfig = {
  // Product queries: 100 requests per minute
  productQueries: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // Search queries: 10 requests per minute
  searchQueries: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  // Facet queries: 2 requests per minute
  facetQueries: {
    maxRequests: 2,
    windowMs: 60 * 1000, // 1 minute
  },
};
