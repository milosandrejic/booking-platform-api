import PropertyRepository from "./PropertyRepository";
import PropertyReviewRepository from "./PropertyReviewRepository";
import { propertyPriceRepository } from "./PropertyPriceRepository";
import { seasonalPriceRepository } from "./SeasonalPriceRepository";

export const propertyRepository = new PropertyRepository();
export const propertyReviewRepository = new PropertyReviewRepository();
export { propertyPriceRepository };
export { seasonalPriceRepository };

export { default as PropertyRepository } from "./PropertyRepository";
export { default as PropertyReviewRepository } from "./PropertyReviewRepository";
