import L, { LatLngExpression, Layer, GeoJSON as LeafletGeoJSON } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  House,
  MapPinIcon,
  RefreshCcwIcon,
  SearchIcon,
  TrendingUpIcon,
  UsersIcon,
  ZoomInIcon,
  ZoomOutIcon,
  LayersIcon,
  ChurchIcon,
  UtensilsIcon,
  ShoppingBagIcon,
  WavesIcon,
  TreesIcon,
  XIcon,
  CheckIcon,
  ArrowRight,
} from 'lucide-react';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Button from '../../../components/ui/Button';
import { ScrollArea } from '../../../components/ui/ScrollArea';

import taytayBarangaysData from '../../../data/taytay-barangays.json';
import pop2024Raw from '../../../data/statistics/population.json';
import tourismData from '../../../data/discover/tourism.json';
import barangayDirectory from '../../../data/directory/barangays.json';
import config from '../../../lib/lguConfig';

import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BarangayData {
  id: string;
  name: string;
  history: PopulationEntry[];
}

interface BarangayProperties {
  NAME_1: string;
  NAME_2: string;
  NAME_3: string;
  ID_3: number;
  TYPE_3: string;
}

interface PopulationEntry {
  year: number;
  population: number;
}

interface Population2024Data {
  meta: {
    source: string;
    notes: string;
    censusDates: Record<string, string>;
  };
  municipality: {
    name: string;
    history: PopulationEntry[];
  };
  barangays: BarangayData[];
}

interface TourismSpot {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  tags: string[];
  featured?: boolean;
  latitude?: number;
  longitude?: number;
  source?: string;
}

type MapMode = 'barangay' | 'establishments';

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  heritage: '#8B5CF6',
  dining: '#F59E0B',
  shopping: '#EC4899',
  recreation: '#10B981',
  nature: '#16A34A',
};

const CATEGORY_ICONS: Record<string, FC<{ className?: string }>> = {
  heritage: ChurchIcon,
  dining: UtensilsIcon,
  shopping: ShoppingBagIcon,
  recreation: WavesIcon,
  nature: TreesIcon,
};

const CATEGORY_LABELS: Record<string, string> = {
  heritage: 'Heritage',
  dining: 'Dining',
  shopping: 'Shopping',
  recreation: 'Recreation',
  nature: 'Nature',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const pop2024 = pop2024Raw as unknown as Population2024Data;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createSpotIcon = (category: string) => {
  const color = CATEGORY_COLORS[category] || '#6B7280';
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 26px;
      height: 26px;
      background: ${color};
      border: 2.5px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -15],
  });
};

const resolveBarangayData = (
  geoJsonName: string,
  popData: Population2024Data
): BarangayData | undefined => {
  if (!geoJsonName) return undefined;
  const normalizedGeoName = geoJsonName
    .toLowerCase()
    .replace(/^santa\s/, 'sta-')
    .replace(/\s+/g, '-');
  return popData.barangays.find(
    b =>
      b.id === normalizedGeoName ||
      b.name.toLowerCase() === geoJsonName.toLowerCase()
  );
};

const resolveBarangayDirectory = (name: string) => {
  if (!name) return undefined;
  const normalized = name
    .toUpperCase()
    .replace(/^SANTA\s+/, 'STA ')
    .replace(/^STA\s+/, 'STA ')
    .trim();
  return barangayDirectory.find(
    b =>
      b.barangay_name
        .toUpperCase()
        .replace(/^STA\s+/, 'STA ')
        .trim() === normalized
  );
};

const initialCenter: LatLngExpression = [
  config.location.coordinates.lat,
  config.location.coordinates.lon,
];
const INITIAL_ZOOM = 12.5;

// ─── Component ────────────────────────────────────────────────────────────────

const TaytayMapPortal: FC = () => {
  const isMobile = useIsMobile();

  // Map state
  const [mapMode, setMapMode] = useState<MapMode>('barangay');
  const [layerPickerOpen, setLayerPickerOpen] = useState(false);

  // Barangay state
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayData | null>(
    null
  );
  const [hoveredBarangayName, setHoveredBarangayName] = useState<string | null>(
    null
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Establishments state
  const [activeEstabCategory, setActiveEstabCategory] = useState<string>('all');

  // Shared search
  const [searchQuery, setSearchQuery] = useState('');

  // Refs
  const mapRef = useRef<L.Map>(null);
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  const layerPickerRef = useRef<HTMLDivElement>(null);

  const [mapData] = useState<
    GeoJSON.FeatureCollection<GeoJSON.Geometry, BarangayProperties>
  >(
    taytayBarangaysData as unknown as GeoJSON.FeatureCollection<
      GeoJSON.Geometry,
      BarangayProperties
    >
  );

  // ── Establishments data ───────────────────────────────────────────────────

  const spotsWithCoords = (tourismData as TourismSpot[]).filter(
    s => s.latitude && s.longitude
  );

  const estabCategoryCounts: Record<string, number> = {};
  spotsWithCoords.forEach(s => {
    estabCategoryCounts[s.category] =
      (estabCategoryCounts[s.category] || 0) + 1;
  });

  const visibleSpots =
    activeEstabCategory === 'all'
      ? spotsWithCoords
      : spotsWithCoords.filter(s => s.category === activeEstabCategory);

  const filteredSpots = visibleSpots.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  // ── Barangay interaction ──────────────────────────────────────────────────

  const onBarangayClick = useCallback(
    (feature: GeoJSON.Feature<GeoJSON.Geometry, BarangayProperties>) => {
      if (!feature.properties) return;
      const rawName = feature.properties.NAME_3;
      if (!isMobile) {
        const bounds = L.geoJSON(feature).getBounds();
        mapRef.current?.fitBounds(bounds, {
          paddingBottomRight: [400, 0],
          maxZoom: 13.5,
          animate: true,
        });
      }
      const resolved = resolveBarangayData(rawName, pop2024);
      setSelectedBarangay(
        resolved ?? {
          id: rawName.toLowerCase().replace(/\s+/g, '-'),
          name: rawName,
          history: [],
        }
      );
    },
    [isMobile]
  );

  const getFeatureName = (
    feature: GeoJSON.Feature<GeoJSON.Geometry, BarangayProperties>
  ): string => feature.properties?.NAME_3 || '';

  const barangayStyle = (
    feature?: GeoJSON.Feature<GeoJSON.Geometry, BarangayProperties>
  ) => {
    if (!feature) return {};
    const barangayName = getFeatureName(feature);
    const isSelected =
      selectedBarangay?.name === barangayName ||
      (selectedBarangay?.id === 'sta-ana' && barangayName === 'Santa Ana');
    const isHovered = hoveredBarangayName === barangayName;
    const isMatched =
      !!searchQuery &&
      barangayName.toLowerCase().includes(searchQuery.toLowerCase());
    const isFilteredOut = !!searchQuery && !isMatched;

    return {
      fillColor:
        isSelected || isMatched
          ? 'var(--color-kapwa-brand-800)'
          : isHovered
            ? 'var(--color-kapwa-brand-700)'
            : 'var(--color-kapwa-neutral-100)',
      weight: isSelected || isHovered || isMatched ? 2 : 1,
      opacity: 1,
      color:
        isSelected || isHovered || isMatched
          ? 'var(--color-kapwa-brand-800)'
          : 'var(--color-kapwa-brand-600)',
      fillOpacity: isFilteredOut ? 0.15 : isSelected ? 0.7 : 0.3,
    };
  };

  const onEachFeature = (
    feature: GeoJSON.Feature<GeoJSON.Geometry, BarangayProperties>,
    layer: Layer
  ) => {
    layer.on({
      click: () => onBarangayClick(feature),
      mouseover: e => {
        setHoveredBarangayName(getFeatureName(feature));
        setMousePos({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
        e.target.setStyle(barangayStyle(feature));
        e.target.bringToFront();
      },
      mousemove: e => {
        setMousePos({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
      },
      mouseout: e => {
        setHoveredBarangayName(null);
        geoJsonLayerRef.current?.resetStyle(e.target);
      },
    });
  };

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.clearLayers();
      geoJsonLayerRef.current.addData(mapData);
    }
  }, [searchQuery, mapData]);

  // Close layer picker when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        layerPickerRef.current &&
        !layerPickerRef.current.contains(e.target as Node)
      ) {
        setLayerPickerOpen(false);
      }
    };
    if (layerPickerOpen) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [layerPickerOpen]);

  // Clear search when switching modes
  useEffect(() => {
    setSearchQuery('');
    setSelectedBarangay(null);
  }, [mapMode]);

  // ── Zoom controls ─────────────────────────────────────────────────────────

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetZoom = () => {
    mapRef.current?.setZoom(INITIAL_ZOOM);
    mapRef.current?.flyTo(initialCenter, INITIAL_ZOOM);
  };

  const currentLatestPopulation =
    selectedBarangay?.history.slice(-1)[0]?.population;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className='flex h-screen bg-kapwa-gray-50 overflow-hidden'>
      {/* ── Map Container ─────────────────────────────────────────────────── */}
      <div className='flex-1 relative'>
        {/* Top bar: Home + Search (constrained width) */}
        <div className='absolute top-4 left-4 z-500 flex flex-row gap-2 items-center'>
          {/* Home */}
          <Link
            to='/'
            className='group flex items-center justify-center bg-kapwa-blue-500 rounded-lg p-2 border-2 border-kapwa-bg-surface text-kapwa-text-inverse font-bold transition-all duration-300 ease-in-out hover:pr-4 shadow-md active:scale-95 shrink-0'
            title='Back to Home'
          >
            <House className='h-6 w-6' />
            <span className='max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:ml-2'>
              Go back home
            </span>
          </Link>

          {/* Search — max-w-xs keeps it from stretching full width */}
          <div className='relative w-64 md:w-72'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-kapwa-text-disabled h-4 w-4 pointer-events-none' />
            <input
              type='text'
              placeholder={
                mapMode === 'barangay'
                  ? 'Search barangays...'
                  : 'Search spots...'
              }
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full pl-9 pr-8 py-2 bg-kapwa-bg-surface border border-kapwa-border-weak rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-kapwa-bg-brand-active text-sm'
            />
            {searchQuery && (
              <button
                title='Clear search'
                onClick={() => setSearchQuery('')}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-kapwa-text-disabled hover:text-kapwa-text-support'
              >
                <XIcon className='h-3.5 w-3.5' />
              </button>
            )}
          </div>
        </div>

        {/* Establishments category filter pills (top-left, below search) */}
        {mapMode === 'establishments' && (
          <div className='absolute top-18 left-4 z-500 flex flex-row gap-1.5 flex-wrap max-w-lg'>
            <button
              onClick={() => setActiveEstabCategory('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md transition-all cursor-pointer ${
                activeEstabCategory === 'all'
                  ? 'bg-kapwa-bg-brand-default text-kapwa-text-inverse'
                  : 'bg-kapwa-bg-surface text-kapwa-text-support hover:bg-kapwa-bg-gray-hover border border-kapwa-border-weak'
              }`}
            >
              All ({spotsWithCoords.length})
            </button>
            {Object.entries(CATEGORY_ICONS).map(([key, Icon]) => {
              const count = estabCategoryCounts[key] || 0;
              if (count === 0) return null;
              const color = CATEGORY_COLORS[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveEstabCategory(key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md transition-all cursor-pointer ${
                    activeEstabCategory === key
                      ? 'text-white border-transparent'
                      : 'bg-kapwa-bg-surface text-kapwa-text-support hover:bg-kapwa-bg-gray-hover border border-kapwa-border-weak'
                  }`}
                  style={
                    activeEstabCategory === key
                      ? { backgroundColor: color }
                      : {}
                  }
                >
                  <Icon className='h-3 w-3' />
                  {CATEGORY_LABELS[key]} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom-right control cluster: Layers picker + Zoom */}
        <div className='absolute bottom-6 right-4 z-500 flex flex-col items-end gap-2'>
          {/* Layer Picker popover */}
          {layerPickerOpen && (
            <div
              ref={layerPickerRef}
              className='mb-1 w-52 bg-kapwa-bg-surface rounded-xl border border-kapwa-border-weak shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150'
            >
              <div className='px-3 pt-3 pb-1.5'>
                <p className='text-[10px] font-bold tracking-widest uppercase text-kapwa-text-disabled'>
                  Map Layers
                </p>
              </div>
              {/* Barangay option */}
              <button
                onClick={() => {
                  setMapMode('barangay');
                  setLayerPickerOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  mapMode === 'barangay'
                    ? 'bg-kapwa-bg-surface-brand'
                    : 'hover:bg-kapwa-bg-hover'
                }`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    mapMode === 'barangay'
                      ? 'border-kapwa-bg-brand-default bg-kapwa-bg-brand-default'
                      : 'border-kapwa-border-strong'
                  }`}
                >
                  {mapMode === 'barangay' && (
                    <CheckIcon className='h-2.5 w-2.5 text-white' />
                  )}
                </div>
                <div className='text-left'>
                  <p className='text-xs font-bold text-kapwa-text-strong leading-snug'>
                    Barangays
                  </p>
                  <p className='text-[10px] text-kapwa-text-disabled leading-snug'>
                    Administrative districts
                  </p>
                </div>
              </button>
              {/* Establishments option */}
              <button
                type='button'
                onClick={() => {
                  setMapMode('establishments');
                  setLayerPickerOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  mapMode === 'establishments'
                    ? 'bg-kapwa-bg-surface-brand'
                    : 'hover:bg-kapwa-bg-hover'
                }`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    mapMode === 'establishments'
                      ? 'border-kapwa-bg-brand-default bg-kapwa-bg-brand-default'
                      : 'border-kapwa-border-strong'
                  }`}
                >
                  {mapMode === 'establishments' && (
                    <CheckIcon className='h-2.5 w-2.5 text-white' />
                  )}
                </div>
                <div className='text-left'>
                  <p className='text-xs font-bold text-kapwa-text-strong leading-snug'>
                    Establishments
                  </p>
                  <p className='text-[10px] text-kapwa-text-disabled leading-snug'>
                    Local spots, dining & shops
                  </p>
                </div>
              </button>
              <div className='h-1' />
            </div>
          )}

          {/* Zoom + Layer button stack */}
          <div className='flex flex-col gap-2'>
            {/* Layers button */}
            <Button
              variant='primary'
              size='sm'
              onClick={() => setLayerPickerOpen(p => !p)}
              aria-label='Map layers'
              title='Map Layers'
              className='shadow-md flex items-center gap-1.5 md:px-3'
            >
              <LayersIcon className='h-4 w-4' />
            </Button>

            <div className='h-1' />

            <Button
              variant='primary'
              size='sm'
              onClick={handleResetZoom}
              aria-label='Reset zoom'
              className='shadow-md'
            >
              <RefreshCcwIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='primary'
              size='sm'
              onClick={handleZoomIn}
              aria-label='Zoom in'
              className='shadow-md'
            >
              <ZoomInIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='primary'
              size='sm'
              onClick={handleZoomOut}
              aria-label='Zoom out'
              className='shadow-md'
            >
              <ZoomOutIcon className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Establishments legend (bottom-left) */}
        {mapMode === 'establishments' && (
          <div className='absolute bottom-6 left-4 z-500 bg-kapwa-bg-surface border border-kapwa-border-weak rounded-xl shadow-md p-3'>
            <p className='text-[10px] font-bold tracking-widest uppercase text-kapwa-text-disabled mb-2'>
              Legend
            </p>
            <div className='flex flex-col gap-1.5'>
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <div key={cat} className='flex items-center gap-2'>
                  <div
                    className='h-3 w-3 rounded-full border-2 border-white shadow-sm shrink-0'
                    style={{ backgroundColor: color }}
                  />
                  <span className='text-[10px] font-semibold text-kapwa-text-support capitalize'>
                    {CATEGORY_LABELS[cat] || cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barangay hover tooltip */}
        {mapMode === 'barangay' && hoveredBarangayName && (
          <div
            className='hidden md:block fixed pointer-events-none bg-kapwa-bg-surface border border-kapwa-border-weak px-3 py-1.5 rounded-lg shadow-lg z-9999'
            style={{
              left: `${mousePos.x + 16}px`,
              top: `${mousePos.y + 10}px`,
            }}
          >
            <p className='text-sm font-semibold text-kapwa-text-strong whitespace-nowrap'>
              Brgy. {hoveredBarangayName}
            </p>
          </div>
        )}

        {/* Leaflet map */}
        <MapContainer
          center={initialCenter}
          zoom={INITIAL_ZOOM}
          ref={mapRef}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          className='z-0'
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {/* Barangay GeoJSON — fills in barangay mode, ghost outline in establishments */}
          {mapData && mapData.features && (
            <GeoJSON
              key={searchQuery + mapMode}
              ref={geoJsonLayerRef}
              data={mapData}
              style={
                mapMode === 'establishments'
                  ? () => ({
                      fillColor: 'transparent',
                      weight: 1,
                      opacity: 0.35,
                      color: 'var(--color-kapwa-brand-600)',
                      fillOpacity: 0,
                    })
                  : barangayStyle
              }
              onEachFeature={mapMode === 'barangay' ? onEachFeature : undefined}
            />
          )}

          {/* Establishment markers */}
          {mapMode === 'establishments' &&
            filteredSpots.map(spot => (
              <Marker
                key={spot.id}
                position={[spot.latitude!, spot.longitude!]}
                icon={createSpotIcon(spot.category)}
              >
                <Popup>
                  <div className='min-w-50 max-w-60'>
                    <span
                      className='inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest mb-1.5'
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[spot.category] || '#6B7280',
                        color: 'white',
                      }}
                    >
                      {CATEGORY_LABELS[spot.category] || spot.category}
                    </span>
                    <h4 className='font-bold text-sm leading-tight mb-1'>
                      {spot.name}
                    </h4>
                    <p className='text-xs text-gray-500 leading-snug mb-1.5'>
                      {spot.description.length > 120
                        ? spot.description.slice(0, 120) + '...'
                        : spot.description}
                    </p>
                    <div className='flex items-start gap-1 text-xs text-gray-400'>
                      <MapPinIcon className='h-3 w-3 shrink-0 mt-0.5' />
                      <span>{spot.address}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* ── Barangay side panel (flex sibling — no absolute overlap) ─────── */}
      {mapMode === 'barangay' && selectedBarangay && (
        <div className='w-full md:w-96 bg-kapwa-bg-surface shadow-xl z-10 flex flex-col border-l border-kapwa-border-weak transition-all duration-300 animate-in slide-in-from-right-4'>
          {/* Panel header */}
          <div className='p-5 border-b border-kapwa-border-weak'>
            <div className='flex justify-between items-start gap-3'>
              <div className='flex-1 min-w-0'>
                <h2 className='text-xl font-bold text-kapwa-text-strong truncate'>
                  Brgy. {selectedBarangay.name}
                </h2>
                <p className='text-xs text-kapwa-text-disabled mt-0.5'>
                  Taytay, Rizal — Administrative Sector
                </p>
                <div className='flex flex-wrap gap-2 mt-3'>
                  <div className='flex items-center gap-1.5 bg-kapwa-blue-50 px-2.5 py-1 rounded-full'>
                    <UsersIcon className='h-3.5 w-3.5 text-kapwa-text-brand' />
                    <span className='text-xs font-semibold text-kapwa-text-accent-blue'>
                      {currentLatestPopulation
                        ? currentLatestPopulation.toLocaleString('en-PH')
                        : 'No Data'}
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5 bg-kapwa-purple-50 px-2.5 py-1 rounded-full'>
                    <MapPinIcon className='h-3.5 w-3.5 text-kapwa-purple-600' />
                    <span className='text-xs font-semibold text-kapwa-purple-700'>
                      1.2 km²
                    </span>
                  </div>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setSelectedBarangay(null)}
                className='text-kapwa-text-disabled hover:text-kapwa-text-support p-1 rounded-lg hover:bg-kapwa-bg-hover transition-colors shrink-0'
                aria-label='Close details'
              >
                <XIcon className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Panel body */}
          <ScrollArea className='flex-1'>
            <div className='p-5 space-y-5'>
              {/* Overview */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-sm font-bold text-kapwa-text-strong'>
                    Overview
                  </h3>
                  <a
                    href={`https://www.philatlas.com/luzon/r04a/rizal/taytay/${selectedBarangay.id}.html`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-kapwa-text-link hover:underline flex items-center gap-1'
                  >
                    PhilAtlas
                    <svg
                      className='h-3 w-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                      />
                    </svg>
                  </a>
                </div>
                <p className='text-sm leading-relaxed text-kapwa-text-support'>
                  {selectedBarangay.name} is an official administrative ward in
                  the municipality of Taytay, Rizal.
                  {currentLatestPopulation &&
                    ` It houses a community of ${currentLatestPopulation.toLocaleString('en-PH')} residents as of our latest data.`}
                </p>
              </div>

              {/* Historical census data */}
              {selectedBarangay.history &&
                selectedBarangay.history.length > 0 && (
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <h3 className='text-sm font-bold text-kapwa-text-strong'>
                        Historical Growth
                      </h3>
                      <TrendingUpIcon className='h-3.5 w-3.5 text-kapwa-text-brand' />
                    </div>
                    <div className='rounded-lg overflow-hidden border border-kapwa-border-weak divide-y divide-kapwa-border-weak'>
                      {selectedBarangay.history.map(record => (
                        <div
                          key={record.year}
                          className='flex justify-between items-center px-3 py-2 text-xs bg-kapwa-bg-surface-raised hover:bg-kapwa-bg-hover transition-colors'
                        >
                          <span className='text-kapwa-text-support'>
                            Census {record.year}
                          </span>
                          <span className='font-bold text-kapwa-text-strong'>
                            {record.population.toLocaleString('en-PH')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Leadership section */}
              {(() => {
                const directoryEntry = resolveBarangayDirectory(
                  selectedBarangay.name
                );
                if (!directoryEntry) return null;

                const punongBarangay = directoryEntry.officials.find(
                  o => o.role === 'Punong Barangay'
                );
                const sbMembers = directoryEntry.officials.filter(
                  o => o.role === 'SB Member'
                );
                const skChairperson = directoryEntry.officials.find(
                  o => o.role === 'SK Chairperson'
                );

                return (
                  <div className='space-y-4 border-t border-kapwa-border-weak pt-4'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='text-sm font-bold text-kapwa-text-strong'>
                        Barangay Leadership
                      </h3>
                      <UsersIcon className='h-3.5 w-3.5 text-kapwa-text-brand' />
                    </div>

                    {punongBarangay && (
                      <div className='bg-kapwa-bg-surface-raised border border-kapwa-border-weak rounded-xl p-3 shadow-xs'>
                        <span className='text-[10px] uppercase tracking-widest font-extrabold text-kapwa-text-disabled'>
                          Punong Barangay
                        </span>
                        <h4 className='text-sm font-bold text-kapwa-text-strong mt-0.5'>
                          {punongBarangay.name}
                        </h4>
                      </div>
                    )}

                    {sbMembers.length > 0 && (
                      <div>
                        <span className='text-[10px] uppercase tracking-widest font-extrabold text-kapwa-text-disabled block mb-2'>
                          Barangay Kagawads (Council Members)
                        </span>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                          {sbMembers.map((member, idx) => (
                            <div
                              key={idx}
                              className='bg-kapwa-bg-surface-raised border border-kapwa-border-weak rounded-lg px-2.5 py-1.5 text-xs text-kapwa-text-support font-semibold'
                            >
                              {member.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {skChairperson && (
                      <div className='bg-kapwa-bg-surface-raised border border-kapwa-border-weak rounded-xl p-3 shadow-xs'>
                        <span className='text-[10px] uppercase tracking-widest font-extrabold text-kapwa-text-disabled'>
                          SK Chairperson
                        </span>
                        <h4 className='text-xs font-bold text-kapwa-text-strong mt-0.5'>
                          {skChairperson.name}
                        </h4>
                      </div>
                    )}

                    <div className='pt-2'>
                      <Link
                        to={`/government/barangays/${directoryEntry.slug}`}
                        className='w-full bg-kapwa-bg-brand-default text-white hover:bg-kapwa-bg-brand-active text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs'
                      >
                        View Full Barangay Profile
                        <ArrowRight className='h-3.5 w-3.5' />
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default TaytayMapPortal;
