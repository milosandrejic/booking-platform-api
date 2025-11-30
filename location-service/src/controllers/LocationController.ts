import { Request, Response } from "express";
import { Client, PlaceAutocompleteType } from "@googlemaps/google-maps-services-js";

type AutocompleteSuggestion = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

type PlaceDetails = {
  placeId: string;
  city: string;
  country: string;
  description: string;
  lat: number;
  lng: number;
}

class LocationController {
  private static googleMapsClient = new Client({});

  /**
   * City autocomplete using Google Places API
   * Returns lightweight suggestions (no coordinates)
   */
  static autocomplete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.query;

      if (!query || typeof query !== "string") {
        res.status(400).send({
          error: "Query parameter is required"
        });
        return;
      }

      const apiKey = process.env.GOOGLE_PLACES_API_KEY;

      if (!apiKey) {
        console.error("GOOGLE_PLACES_API_KEY is not configured");
        res.status(500).send({
          error: "Geocoding service is not configured"
        });
        return;
      }

      const response = await LocationController.googleMapsClient.placeAutocomplete({
        params: {
          input: query,
          types: PlaceAutocompleteType.cities,
          key: apiKey
        }
      });

      if (response.data.status !== "OK" && response.data.status !== "ZERO_RESULTS") {
        console.error("Google Places API error:", response.data.status);
        res.status(500).send({
          error: "Geocoding service error"
        });
        return;
      }

      const suggestions: AutocompleteSuggestion[] = response.data.predictions.slice(0, 5).map(prediction => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting.main_text,
        secondaryText: prediction.structured_formatting.secondary_text
      }));

      res.status(200).send({
        suggestions
      });
    } catch (error) {
      console.error("Autocomplete error:", error);
      res.status(500).send({
        error: "Failed to fetch autocomplete suggestions"
      });
    }
  };

  /**
   * Get place details including coordinates
   */
  static placeDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { placeId } = req.params;

      if (!placeId) {
        res.status(400).send({
          error: "Place ID is required"
        });
        return;
      }

      const apiKey = process.env.GOOGLE_PLACES_API_KEY;

      if (!apiKey) {
        console.error("GOOGLE_PLACES_API_KEY is not configured");
        res.status(500).send({
          error: "Geocoding service is not configured"
        });
        return;
      }

      const response = await LocationController.googleMapsClient.placeDetails({
        params: {
          place_id: placeId,
          fields: ["geometry", "address_components", "formatted_address"],
          key: apiKey
        }
      });

      if (response.data.status !== "OK") {
        console.error("Place details error:", response.data.status);
        res.status(404).send({
          error: "Place not found"
        });
        return;
      }

      const place = response.data.result;
      const location = place.geometry?.location;

      let city = "";
      let country = "";

      if (place.address_components) {
        for (const component of place.address_components) {
          const types = component.types as string[];
          if (types.includes("locality")) {
            city = component.long_name;
          }
          if (types.includes("country")) {
            country = component.long_name;
          }
        }
      }

      if (!city || !country) {
        const parts = place.formatted_address?.split(", ") || [];
        city = city || parts[0] || "";
        country = country || parts[parts.length - 1] || "";
      }

      const details: PlaceDetails = {
        placeId,
        city,
        country,
        description: place.formatted_address || "",
        lat: location?.lat || 0,
        lng: location?.lng || 0
      };

      res.status(200).send(details);
    } catch (error) {
      console.error("Place details error:", error);
      res.status(500).send({
        error: "Failed to fetch place details"
      });
    }
  };
}

export default LocationController;
