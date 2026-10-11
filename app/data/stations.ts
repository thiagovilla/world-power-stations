import type { PowerStation } from '~/types/station';

export const sampleStations: PowerStation[] = [
  {
    id: 'three-gorges',
    name: 'Three Gorges Dam',
    country: 'China',
    countryFlag: '🇨🇳',
    location: 'Yiling District, Yichang, Hubei, China',
    fuelType: 'hydro',
    capacityMW: 22500,
    coordinates: [111.0033, 30.8267],
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    description:
      'The Three Gorges Dam spans the Yangtze River and is the world’s largest power station by installed capacity (22,500 MW). Completed in 2012, it provides immense clean hydroelectric output, regulates downstream flooding, and significantly improves river navigation across central China.',
  },
  {
    id: 'itaipu',
    name: 'Itaipu Dam',
    country: 'Brazil / Paraguay',
    countryFlag: '🇧🇷 🇵🇾',
    location: 'Paraná River, Brazil–Paraguay border',
    fuelType: 'hydro',
    capacityMW: 14000,
    coordinates: [-54.5889, -25.4089],
    imageUrl: 'https://images.unsplash.com/photo-1629814696225-78e0d37e6f66?auto=format&fit=crop&w=800&q=80',
    description:
      'A binational hydroelectric facility jointly operated by Brazil and Paraguay on the Paraná River. With 14,000 MW capacity, Itaipu set historical world records for cumulative electricity generation, supplying a substantial percentage of electrical demand for both partner nations.',
  },
  {
    id: 'kashiwazaki-kariwa',
    name: 'Kashiwazaki-Kariwa Nuclear Power Plant',
    country: 'Japan',
    countryFlag: '🇯🇵',
    location: 'Kashiwazaki & Kariwa, Niigata Prefecture, Japan',
    fuelType: 'nuclear',
    capacityMW: 7965,
    coordinates: [138.5986, 37.4269],
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    description:
      'Operated by TEPCO on the Sea of Japan coast, Kashiwazaki-Kariwa is the largest nuclear generating plant in the world by net capacity across its seven boiling water reactor units. It incorporates state-of-the-art seismic isolation and advanced containment protections.',
  },
  {
    id: 'bhadla-solar',
    name: 'Bhadla Solar Park',
    country: 'India',
    countryFlag: '🇮🇳',
    location: 'Phalodi, Jodhpur District, Rajasthan, India',
    fuelType: 'solar',
    capacityMW: 2245,
    coordinates: [71.9167, 27.5333],
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    description:
      'Spanning more than 14,000 acres in the arid Thar Desert, Bhadla Solar Park is one of the world’s largest operational photovoltaic power installations. Taking advantage of the region’s intense solar irradiance, it feeds high-capacity renewable power into India’s national grid.',
  },
  {
    id: 'hornsea-wind',
    name: 'Hornsea Wind Farm',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    location: 'North Sea (120 km off Yorkshire coast), United Kingdom',
    fuelType: 'wind',
    capacityMW: 1218,
    coordinates: [1.9, 53.9],
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    description:
      'Located deep in the stormy waters of the North Sea, Hornsea is a flagship offshore wind mega-project. Utilizing massive high-efficiency offshore turbines, it powers millions of British households and spearheads the United Kingdom’s decarbonization milestones.',
  },
  {
    id: 'grand-coulee',
    name: 'Grand Coulee Dam',
    country: 'United States',
    countryFlag: '🇺🇸',
    location: 'Columbia River, Washington, United States',
    fuelType: 'hydro',
    capacityMW: 6809,
    coordinates: [-118.9814, 47.9572],
    imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80',
    description:
      'A cornerstone of Pacific Northwest infrastructure, Grand Coulee Dam is the largest electric power-producing facility in the United States. Constructed between 1933 and 1942 on the Columbia River, it supplies crucial peaking power and irrigation for half a million acres.',
  },
  {
    id: 'hellisheidi',
    name: 'Hellisheiði Power Station',
    country: 'Iceland',
    countryFlag: '🇮🇸',
    location: 'Hengill Volcano, Southwest Iceland',
    fuelType: 'geothermal',
    capacityMW: 303,
    coordinates: [-21.4019, 64.0378],
    imageUrl: 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?auto=format&fit=crop&w=800&q=80',
    description:
      'Situated on the Hengill volcanic system, Hellisheiði is one of the world’s most advanced flash geothermal plants. In addition to delivering 303 MW of clean electricity, it supplies hot water for district heating in Reykjavik and pioneers commercial direct air carbon capture storage (CarbFix).',
  },
  {
    id: 'bruce-nuclear',
    name: 'Bruce Nuclear Generating Station',
    country: 'Canada',
    countryFlag: '🇨🇦',
    location: 'Tiverton, Bruce County, Ontario, Canada',
    fuelType: 'nuclear',
    capacityMW: 6550,
    coordinates: [-81.5972, 44.3256],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description:
      'Perched on the eastern shore of Lake Huron, Bruce Power is North America’s largest operational nuclear facility. Featuring eight CANDU pressurized heavy-water reactors, it provides approximately 30% of Ontario’s electricity while producing critical medical isotopes like Cobalt-60.',
  },
  {
    id: 'drax',
    name: 'Drax Power Station',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    location: 'Selby, North Yorkshire, United Kingdom',
    fuelType: 'biomass',
    capacityMW: 3906,
    coordinates: [-0.9997, 53.7381],
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    description:
      'Originally Western Europe’s largest coal station, Drax underwent an ambitious conversion to sustainably sourced compressed wood pellets. Today it is the UK’s single largest generator of renewable dispatchable power and is pioneering bioenergy with carbon capture and storage (BECCS).',
  },
  {
    id: 'gansu-wind',
    name: 'Gansu Wind Farm',
    country: 'China',
    countryFlag: '🇨🇳',
    location: 'Jiuquan, Gansu Province, China',
    fuelType: 'wind',
    capacityMW: 20000,
    coordinates: [96.0, 40.0],
    imageUrl: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=800&q=80',
    description:
      'Also known as the Jiuquan Wind Power Base, this complex situated along the edge of the Gobi Desert is the largest wind power installation globally. Thousands of wind turbines connect to ultra-high-voltage direct-current (UHVDC) transmission lines to deliver green electricity to eastern cities.',
  },
  {
    id: 'surgut-2',
    name: 'Surgut-2 Power Station',
    country: 'Russia',
    countryFlag: '🇷🇺',
    location: 'Surgut, Khanty-Mansi Autonomous Okrug, Russia',
    fuelType: 'gas',
    capacityMW: 5687,
    coordinates: [73.4739, 61.2789],
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80',
    description:
      'Positioned near the Ob River in Western Siberia, Surgut-2 is the most powerful thermal combined-cycle gas power station in Russia and the second-largest globally. Fired primarily by associated petroleum gas from surrounding oil fields, it powers the Siberian industrial basin.',
  },
  {
    id: 'taichung',
    name: 'Taichung Power Plant',
    country: 'Taiwan',
    countryFlag: '🇹🇼',
    location: 'Longjing District, Taichung, Taiwan',
    fuelType: 'coal',
    capacityMW: 5780,
    coordinates: [120.4853, 24.2128],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description:
      'Located along the coast of central Taiwan, Taichung Power Plant is a critical base-load facility with ten coal-fired units and gas turbines. Operated by Taipower, it provides vital energy stability to Taiwan’s high-tech manufacturing corridors while undergoing modern emissions upgrades.',
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

export function stationsToGeoJSON(stations: PowerStation[] = []): StationGeoJSONCollection {
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
