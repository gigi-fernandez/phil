declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options?: any);
      setCenter(location: { lat: number; lng: number }): void;
      setZoom(zoom: number): void;
      addListener(event: string, handler: (...args: any[]) => void): void;
    }

    class Marker {
      constructor(options?: any);
      setPosition(location: { lat: number; lng: number }): void;
      getPosition(): { lat: () => number; lng: () => number } | null;
      addListener(event: string, handler: () => void): void;
    }

    class Geocoder {
      geocode(
        request: { location: { lat: number; lng: number } },
        callback: (
          results: Array<{ formatted_address: string }> | null,
          status: string
        ) => void
      ): void;
    }

    interface MapMouseEvent {
      latLng?: {
        lat: () => number;
        lng: () => number;
      };
    }

    enum Animation {
      DROP = 1,
    }

    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: { input: string; componentRestrictions?: { country: string } },
          callback: (
            predictions: Array<{
              description: string;
              place_id: string;
              structured_formatting: {
                main_text: string;
                secondary_text: string;
              };
            }> | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
      }

      class PlacesService {
        constructor(map: Map);
        getDetails(
          request: { placeId: string },
          callback: (
            place: {
              formatted_address?: string;
              geometry?: {
                location?: {
                  lat: () => number;
                  lng: () => number;
                };
              };
            } | null,
            status: string
          ) => void
        ): void;
      }

      enum PlacesServiceStatus {
        OK = 'OK',
      }
    }
  }
}

interface Window {
  google?: typeof google;
}
