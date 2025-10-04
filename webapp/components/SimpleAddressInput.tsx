'use client';

import { MapPin } from 'lucide-react';

interface SimpleAddressInputProps {
  address: string;
  onAddressChange: (address: string) => void;
}

export default function SimpleAddressInput({ address, onAddressChange }: SimpleAddressInputProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 text-gray-600" size={20} />
        <textarea
          required
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          rows={3}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Enter your full delivery address&#10;e.g., 123 Main St, Apt 4B&#10;New York, NY 10001"
        />
      </div>
      <div className="text-sm text-gray-600">
        <p>• Enter your complete address including apartment/suite number</p>
        <p>• Make sure to include city, state, and ZIP code</p>
        <p>• Driver will call if they need additional directions</p>
      </div>
    </div>
  );
}