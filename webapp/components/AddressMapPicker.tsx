'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';

interface AddressMapPickerProps {
  address: string;
  onAddressChange: (address: string, coordinates?: { lat: number; lng: number }) => void;
}

export default function AddressMapPicker({ address, onAddressChange }: AddressMapPickerProps) {
  const [searchQuery, setSearchQuery] = useState(address);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      console.warn('Google Maps API key not configured. Map features disabled.');
      return;
    }

    // Prevent multiple loads
    if (window.google?.maps) {
      initializeMap();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      return;
    }

    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('Failed to load Google Maps');
      };
      document.head.appendChild(script);
    }
  }, []);

  const initializeMap = () => {
    const mapElement = document.getElementById('map');
    if (!mapElement || !window.google) {
      console.log('Map element or Google Maps not ready');
      return;
    }

    // Prevent reinitializing if already done
    if (map) {
      console.log('Map already initialized');
      return;
    }

    const sydneyCBD = { lat: -33.8688, lng: 151.2093 }; // Sydney CBD
    const mapInstance = new google.maps.Map(mapElement, {
      center: userLocation || sydneyCBD,
      zoom: 15,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      gestureHandling: 'greedy', // Allow single finger touch
    });

    const markerInstance = new google.maps.Marker({
      map: mapInstance,
      position: userLocation || sydneyCBD,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    markerInstance.addListener('dragend', () => {
      const position = markerInstance.getPosition();
      if (position) {
        reverseGeocode(position.lat(), position.lng());
      }
    });

    mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        markerInstance.setPosition(e.latLng);
        reverseGeocode(e.latLng.lat(), e.latLng.lng());
      }
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!window.google) return;
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        // Filter for Australian addresses
        const australianResult = results.find(r => 
          r.formatted_address.includes('Australia') || 
          r.formatted_address.includes('NSW') ||
          r.formatted_address.includes('VIC') ||
          r.formatted_address.includes('QLD')
        );
        
        const formattedAddress = australianResult?.formatted_address || results[0].formatted_address;
        setSearchQuery(formattedAddress);
        onAddressChange(formattedAddress, { lat, lng });
      } else {
        // If geocoding fails, provide coordinates as fallback
        const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setSearchQuery(fallbackAddress);
        onAddressChange(fallbackAddress, { lat, lng });
        console.warn('Geocoding failed:', status);
      }
    });
  };

  const searchPlaces = useCallback(async (query: string) => {
    if (!window.google || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: 'au' }, // Restrict to Australia
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, []);

  const selectPlace = async (placeId: string) => {
    if (!window.google || !map) return;

    const service = new google.maps.places.PlacesService(map);
    service.getDetails({ placeId }, (place, status) => {
      if (status === 'OK' && place && place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        map.setCenter({ lat, lng });
        marker?.setPosition({ lat, lng });
        
        setSearchQuery(place.formatted_address || '');
        onAddressChange(place.formatted_address || '', { lat, lng });
        setShowSuggestions(false);
      }
    });
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('Got location:', lat, lng);
        setUserLocation({ lat, lng });
        
        if (map && marker) {
          map.setCenter({ lat, lng });
          marker.setPosition({ lat, lng });
          map.setZoom(17); // Zoom in closer to user location
          reverseGeocode(lat, lng);
        } else {
          // If map not ready yet, initialize with user location
          setUserLocation({ lat, lng });
          initializeMap();
        }
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = 'Unable to get your location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        
        alert(errorMessage);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery && searchQuery !== address) {
        searchPlaces(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, address, searchPlaces]);

  return (
    <div className="space-y-4">
      {/* Use Current Location Button */}
      <button
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Navigation size={20} />
        {isLoading ? 'Getting Location...' : 'Use My Current Location'}
      </button>

      <div className="relative flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-600">or enter address</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for your address in Sydney"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => selectPlace(suggestion.place_id)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b last:border-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">
                      {suggestion.structured_formatting.main_text}
                    </p>
                    <p className="text-xs text-gray-600">
                      {suggestion.structured_formatting.secondary_text}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative">
        <div 
          id="map" 
          className="w-full h-64 rounded-lg border border-gray-300"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow text-xs text-gray-600">
          Click or drag pin to adjust location
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <p>• For "Use My Current Location", allow browser location access when prompted</p>
        <p>• Or search for your address in the field above</p>
        <p>• Click on the map or drag the pin to fine-tune the delivery location</p>
        <p className="text-xs mt-1">Note: Location services must be enabled on your device for current location to work</p>
      </div>
    </div>
  );
}