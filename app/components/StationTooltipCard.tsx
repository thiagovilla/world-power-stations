import { useState } from 'react';
import type { PowerStation, FuelType } from '~/types/station';

interface StationTooltipCardProps {
  station: PowerStation;
}

const FUEL_TYPE_CONFIG: Record<
  FuelType,
  { label: string; color: string; bg: string; border: string; text: string; icon: string }
> = {
  hydro: {
    label: 'Hydro',
    color: '#0284c7',
    bg: 'bg-sky-500/15',
    border: 'border-sky-500/40',
    text: 'text-sky-400',
    icon: '💧',
  },
  nuclear: {
    label: 'Nuclear',
    color: '#7c3aed',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/40',
    text: 'text-purple-400',
    icon: '⚛️',
  },
  solar: {
    label: 'Solar',
    color: '#eab308',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    icon: '☀️',
  },
  wind: {
    label: 'Wind',
    color: '#10b981',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    text: 'text-emerald-400',
    icon: '💨',
  },
  gas: {
    label: 'Natural Gas',
    color: '#f97316',
    bg: 'bg-orange-500/15',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    icon: '🔥',
  },
  coal: {
    label: 'Coal',
    color: '#6b7280',
    bg: 'bg-slate-500/15',
    border: 'border-slate-500/40',
    text: 'text-slate-300',
    icon: '🪨',
  },
  geothermal: {
    label: 'Geothermal',
    color: '#ef4444',
    bg: 'bg-red-500/15',
    border: 'border-red-500/40',
    text: 'text-red-400',
    icon: '🌋',
  },
  biomass: {
    label: 'Biomass',
    color: '#84cc16',
    bg: 'bg-lime-500/15',
    border: 'border-lime-500/40',
    text: 'text-lime-400',
    icon: '🌱',
  },
};

export function StationTooltipCard({ station }: StationTooltipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fuelConfig = FUEL_TYPE_CONFIG[station.fuelType] || {
    label: station.fuelType,
    color: '#3b82f6',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    icon: '⚡',
  };

  const isLong = station.description.length > 100;
  const breakIndex = station.description.lastIndexOf(' ', 100);
  const previewText = isLong
    ? station.description.slice(0, breakIndex > 50 ? breakIndex : 100)
    : station.description;

  return (
    <div className="w-80 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/95 font-sans text-slate-100 shadow-2xl backdrop-blur-md select-text">
      {/* Featured Image Container */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-800">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800 animate-pulse">
                <span className="text-2xl opacity-40">{fuelConfig.icon}</span>
              </div>
            )}
            <img
              src={station.imageUrl}
              alt={station.name}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400">
            <span className="text-3xl">{fuelConfig.icon}</span>
            <span className="text-xs font-medium tracking-wider uppercase">{fuelConfig.label} Power</span>
          </div>
        )}

        {/* Ambient Gradient for contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Fuel Type Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-md backdrop-blur-md border ${fuelConfig.bg} ${fuelConfig.border} ${fuelConfig.text}`}
          >
            <span>{fuelConfig.icon}</span>
            <span>{fuelConfig.label}</span>
          </span>
        </div>

        {/* Capacity Overlay Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-slate-950/85 px-2.5 py-1 text-xs font-bold text-amber-400 shadow-md backdrop-blur-md">
            <span>⚡</span>
            <span>{station.capacityMW.toLocaleString()} MW</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h3 className="text-base font-bold tracking-tight text-white leading-snug">
            {station.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-sm" aria-hidden="true">
              {station.countryFlag}
            </span>
            <span className="truncate">{station.location}</span>
          </div>
        </div>

        {/* YouTube-style Expandable Description */}
        <div className="rounded-lg border border-slate-700/40 bg-slate-800/60 p-2.5 text-xs leading-relaxed text-slate-300">
          <p className="inline">
            {isExpanded ? station.description : previewText}
          </p>
          {isLong && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="ml-1 inline cursor-pointer text-xs font-medium text-sky-400 transition-colors hover:text-sky-300 focus:outline-none"
            >
              {isExpanded ? 'show less' : '...show more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
