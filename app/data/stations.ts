import type { PowerStation } from '~/types/station';

export const sampleStations: PowerStation[] = [
  {
    id: 'three-gorges',
    name: 'Three Gorges Dam',
    country: 'China',
    fuelType: 'hydro',
    capacityMW: 22500,
    coordinates: [111.0033, 30.8267],
  },
  {
    id: 'itaipu',
    name: 'Itaipu Dam',
    country: 'Brazil / Paraguay',
    fuelType: 'hydro',
    capacityMW: 14000,
    coordinates: [-54.5889, -25.4089],
  },
  {
    id: 'kashiwazaki-kariwa',
    name: 'Kashiwazaki-Kariwa Nuclear Power Plant',
    country: 'Japan',
    fuelType: 'nuclear',
    capacityMW: 7965,
    coordinates: [138.5986, 37.4269],
  },
  {
    id: 'bhadla-solar',
    name: 'Bhadla Solar Park',
    country: 'India',
    fuelType: 'solar',
    capacityMW: 2245,
    coordinates: [71.9167, 27.5333],
  },
  {
    id: 'hornsea-wind',
    name: 'Hornsea Wind Farm',
    country: 'United Kingdom',
    fuelType: 'wind',
    capacityMW: 1218,
    coordinates: [1.9, 53.9],
  },
  {
    id: 'grand-coulee',
    name: 'Grand Coulee Dam',
    country: 'United States',
    fuelType: 'hydro',
    capacityMW: 6809,
    coordinates: [-118.9814, 47.9572],
  },
  {
    id: 'hellisheidi',
    name: 'Hellisheiði Power Station',
    country: 'Iceland',
    fuelType: 'geothermal',
    capacityMW: 303,
    coordinates: [-21.4019, 64.0378],
  },
  {
    id: 'bruce-nuclear',
    name: 'Bruce Nuclear Generating Station',
    country: 'Canada',
    fuelType: 'nuclear',
    capacityMW: 6550,
    coordinates: [-81.5972, 44.3256],
  },
  {
    id: 'drax',
    name: 'Drax Power Station',
    country: 'United Kingdom',
    fuelType: 'biomass',
    capacityMW: 3906,
    coordinates: [-0.9997, 53.7381],
  },
  {
    id: 'gansu-wind',
    name: 'Gansu Wind Farm',
    country: 'China',
    fuelType: 'wind',
    capacityMW: 20000,
    coordinates: [96.0, 40.0],
  },
  {
    id: 'surgut-2',
    name: 'Surgut-2 Power Station',
    country: 'Russia',
    fuelType: 'gas',
    capacityMW: 5687,
    coordinates: [73.4739, 61.2789],
  },
  {
    id: 'taichung',
    name: 'Taichung Power Plant',
    country: 'Taiwan',
    fuelType: 'coal',
    capacityMW: 5780,
    coordinates: [120.4853, 24.2128],
  },
];

export interface StationGeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: PowerStation;
}

export interface StationGeoJSONCollection {
  type: 'FeatureCollection';
  features: StationGeoJSONFeature[];
}

export function stationsToGeoJSON(stations: PowerStation[]): StationGeoJSONCollection {
  return {
    type: 'FeatureCollection',
    features: stations.map((station) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: station.coordinates,
      },
      properties: station,
    })),
  };
}
