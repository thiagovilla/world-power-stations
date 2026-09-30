import type { Route } from "./+types/home";
import { WorldMap } from "~/components/WorldMap";
import { sampleStations } from "~/data/stations";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "World Power Stations - Interactive Global Map of Power Generation" },
    {
      name: "description",
      content:
        "Explore power stations and electricity generation facilities around the world.",
    },
  ];
}

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Floating Header Overlay */}
      <header className="pointer-events-none absolute top-4 left-4 z-10 flex flex-col gap-1 rounded-xl border border-slate-700/60 bg-slate-900/85 px-4 py-3 text-slate-100 shadow-2xl backdrop-blur-md sm:min-w-64">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 font-bold text-sm">
            ⚡
          </span>
          <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
            World Power Stations
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Global power generation & storage facilities
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400 ring-1 ring-inset ring-blue-500/30">
            {sampleStations.length} Sample Stations
          </span>
        </div>
      </header>

      {/* Interactive World Map */}
      <WorldMap stations={sampleStations} className="h-full w-full" />
    </main>
  );
}
