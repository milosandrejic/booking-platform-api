import { Request, Response } from "express";
import { Client, PlaceAutocompleteType } from "@googlemaps/google-maps-services-js";

interface AutocompleteSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface PlaceDetails {
  placeId: string;
  city: string;
  country: string;
  description: string;
  lat: number;
  lng: number;
}

class PropertySearchController {
  private static googleMapsClient = new Client({});

  /**
   * City autocomplete using Google Places API
   * Returns lightweight suggestions (no coordinates)
   * Frontend should call /place-details with selected placeId to get coordinates
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

      // Call Google Places Autocomplete API
      const response = await PropertySearchController.googleMapsClient.placeAutocomplete({
        params: {
          input: query,
          types: PlaceAutocompleteType.cities, // Only return cities
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

      // Map predictions to lightweight suggestions
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
   * Called when user selects a location from autocomplete
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

      // Get place details including geometry (coordinates)
      const response = await PropertySearchController.googleMapsClient.placeDetails({
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

      // Extract city and country from address components
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

      // Fallback: parse from formatted address
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

  /**
   * Main property search endpoint (to be implemented)
   */
  static search = async (req: Request, res: Response): Promise<void> => {
    res.status(501).send({
      error: "Search endpoint not yet implemented"
    });
  };
}

export default PropertySearchController;
