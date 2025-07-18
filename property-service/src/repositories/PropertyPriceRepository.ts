import { dataSource } from "src/db/config";
import PropertyPrice from "src/model/PropertyPrice";

export const propertyPriceRepository = dataSource.getRepository(PropertyPrice);
