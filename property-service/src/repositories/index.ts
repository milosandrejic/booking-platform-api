import PropertyRepository from "./PropertyRepository";
import PropertyReviewRepository from "./PropertyReviewRepository";

export const propertyRepository = new PropertyRepository();
export const propertyReviewRepository = new PropertyReviewRepository();

export { default as PropertyRepository } from "./PropertyRepository";
export { default as PropertyReviewRepository } from "./PropertyReviewRepository";
