import {useEffect, useRef} from 'react';
import {type GeoJSONSource, Map as MapLibreMap, NavigationControl, Popup, setWorkerUrl,} from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import {createRoot, type Root} from 'react-dom/client';
import type {PowerStation} from '~/types/station';
import {stationsToGeoJSON} from '~/data/stations';
import {StationTooltipCard} from '~/components/StationTooltipCard';

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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const stationsRef = useRef<PowerStation[]>(stations);

  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);

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

    let activePopup: Popup | null = null;
    let activeRoot: Root | null = null;
    let closeTimer: ReturnType<typeof setTimeout> | null = null;
    let hoveredStationId: string | null = null;

    const cleanupPopup = () => {
      hoveredStationId = null;
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      if (activePopup) {
        activePopup.remove();
        activePopup = null;
      }
      if (activeRoot) {
        activeRoot.unmount();
        activeRoot = null;
      }
    };

    // Add navigation controls (zoom, pitch, compass)
    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      // Add station GeoJSON source
      map.addSource('stations', {
        type: 'geojson',
        data: stationsToGeoJSON(stationsRef.current),
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

      // Mouse enter station marker
      map.on('mouseenter', 'stations-layer', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        const feature = e.features?.[0];
        if (!feature || !feature.properties) return;

        const stationId = feature.properties.id as string;
        if (hoveredStationId === stationId && activePopup) {
          if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
          }
          return;
        }

        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }

        hoveredStationId = stationId;

        const currentStations = stationsRef.current;
        const station =
          currentStations.find((s) => s.id === stationId) ||
          (feature.properties as unknown as PowerStation);

        if (activePopup) {
          activePopup.remove();
          activePopup = null;
        }
        if (activeRoot) {
          activeRoot.unmount();
          activeRoot = null;
        }

        const popupNode = document.createElement('div');
        popupNode.className = 'station-tooltip-container';

        popupNode.addEventListener('mouseenter', () => {
          if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
          }
        });

        popupNode.addEventListener('mouseleave', () => {
          if (closeTimer) clearTimeout(closeTimer);
          closeTimer = setTimeout(() => {
            cleanupPopup();
          }, 200);
        });

        const root = createRoot(popupNode);
        activeRoot = root;
        root.render(<StationTooltipCard station={station} />);

        const geometry = feature.geometry as { type: string; coordinates: [number, number] };
        const coords = geometry.coordinates;

        activePopup = new Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 14,
          maxWidth: '340px',
          className: 'station-popup',
        })
            .setLngLat(coords)
            .setDOMContent(popupNode)
            .addTo(map);
      });

      // Mouse leave station marker
      map.on('mouseleave', 'stations-layer', () => {
        map.getCanvas().style.cursor = '';
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          cleanupPopup();
        }, 200);
      });
    });

    return () => {
      cleanupPopup();
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
