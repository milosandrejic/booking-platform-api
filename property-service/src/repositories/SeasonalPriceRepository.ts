import { dataSource } from "src/db/config";
import SeasonalPrice from "src/model/SeasonalPrice";

export const seasonalPriceRepository = dataSource.getRepository(SeasonalPrice);
