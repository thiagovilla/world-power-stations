import { useEffect, useRef } from 'react';
import {
  Map as MapLibreMap,
  NavigationControl,
  type GeoJSONSource,
    setWorkerUrl
} from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { PowerStation } from '~/types/station';
import { stationsToGeoJSON } from '~/data/stations';

setWorkerUrl(workerUrl);

export interface WorldMapProps {
  stations?: PowerStation[];
  className?: string;
}

const FUEL_COLORS: Record<string, string> = {
  hydro: '#0284c7', // Sky blue
  nuclear: '#a855f7', // Purple
  solar: '#eab308', // Amber / Yellow
  wind: '#10b981', // Emerald green
  gas: '#f97316', // Orange
  coal: '#4b5563', // Dark slate / Charcoal
  geothermal: '#ef4444', // Red
  biomass: '#84cc16', // Lime green
};

const DEFAULT_STATION_COLOR = '#3b82f6';

export function WorldMap({ stations = [], className = '' }: WorldMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 20],
      zoom: 2,
      minZoom: 1,
      maxZoom: 18,
    });

    mapRef.current = map;

    // Add navigation controls (zoom, pitch, compass)
    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      // Add station GeoJSON source
      map.addSource('stations', {
        type: 'geojson',
        data: stationsToGeoJSON(stations),
      });

      // Add circle layer for station markers
      map.addLayer({
        id: 'stations-layer',
        type: 'circle',
        source: 'stations',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1,
            5,
            6,
            8,
            12,
            12,
          ],
          'circle-color': [
            'match',
            ['get', 'fuelType'],
            'hydro',
            FUEL_COLORS.hydro,
            'nuclear',
            FUEL_COLORS.nuclear,
            'solar',
            FUEL_COLORS.solar,
            'wind',
            FUEL_COLORS.wind,
            'gas',
            FUEL_COLORS.gas,
            'coal',
            FUEL_COLORS.coal,
            'geothermal',
            FUEL_COLORS.geothermal,
            'biomass',
            FUEL_COLORS.biomass,
            DEFAULT_STATION_COLOR,
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
          'circle-stroke-opacity': 0.95,
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update GeoJSON source when stations prop changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('stations') as GeoJSONSource | undefined;
    if (source) {
      source.setData(stationsToGeoJSON(stations));
    }
  }, [stations]);

  return (
    <div
      ref={mapContainerRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      data-testid="world-map-container"
    />
  );
}
