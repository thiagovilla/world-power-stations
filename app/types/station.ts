export type FuelType =
  | 'hydro'
  | 'nuclear'
  | 'solar'
  | 'wind'
  | 'gas'
  | 'coal'
  | 'geothermal'
  | 'biomass';

export interface PowerStation {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  location: string;
  fuelType: FuelType;
  capacityMW: number;
  coordinates: [number, number]; // [longitude, latitude]
  imageUrl: string;
  description: string;
}
