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
} from 'lucide-react';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import Button from '../../../components/ui/Button';
import { ScrollArea } from '../../../components/ui/ScrollArea';

import taytayBarangaysData from '../../../data/taytay-barangays.json';
import pop2024Raw from '../../../data/statistics/population.json';
import config from '../../../lib/lguConfig';

import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Define types for Barangay data and GeoJSON properties
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

const pop2024 = pop2024Raw as unknown as Population2024Data;

const resolveBarangayData = (
  geoJsonName: string,
  popData: Population2024Data
): BarangayData | undefined => {
  if (!geoJsonName) return undefined;

  // Standardize name variants: lowercase, replace "santa" with "sta", swap spaces for hyphens
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

const initialCenter: LatLngExpression = [
  config.location.coordinates.lat,
  config.location.coordinates.lon,
];

const TaytayMapPortal: FC = () => {
  const isMobile = useIsMobile();
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayData | null>(
    null
  );
  const [hoveredBarangayName, setHoveredBarangayName] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mapRef = useRef<L.Map>(null);
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);

  const [mapData] = useState<
    GeoJSON.FeatureCollection<GeoJSON.Geometry, BarangayProperties>
  >(
    taytayBarangaysData as unknown as GeoJSON.FeatureCollection<
      GeoJSON.Geometry,
      BarangayProperties
    >
  );

  const initialZoom = 12.5;

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
      if (resolved) {
        setSelectedBarangay(resolved);
      } else {
        setSelectedBarangay({
          id: rawName.toLowerCase().replace(/\s+/g, '-'),
          name: rawName,
          history: [],
        });
      }
    },
    [isMobile]
  );

  const getFeatureName = (
    feature: GeoJSON.Feature<GeoJSON.Geometry, BarangayProperties>
  ): string => {
    return feature.properties?.NAME_3 || '';
  };

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
      searchQuery &&
      barangayName.toLowerCase().includes(searchQuery.toLowerCase());
    const isFilteredOut = searchQuery && !isMatched;

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

      fillOpacity: isFilteredOut ? 0.2 : isSelected ? 0.7 : 0.3,
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
        // Capture initial position
        setMousePos({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
        e.target.setStyle(barangayStyle(feature));
        e.target.bringToFront();
      },
      mousemove: e => {
        // Update position as mouse moves
        setMousePos({ x: e.originalEvent.pageX, y: e.originalEvent.pageY });
      },
      mouseout: e => {
        setHoveredBarangayName(null);
        if (geoJsonLayerRef.current) {
          geoJsonLayerRef.current.resetStyle(e.target);
        }
      },
    });
  };

  useEffect(() => {
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.clearLayers();
      geoJsonLayerRef.current.addData(mapData);
    }
  }, [searchQuery, mapData]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetZoom = () => {
    mapRef.current?.setZoom(initialZoom);
    mapRef.current?.flyTo(initialCenter, initialZoom);
  };

  useEffect(() => {
    const zoomControls = document.getElementById('zoom-controls');
    if (selectedBarangay) {
      zoomControls?.classList.add('right-105');
    } else {
      zoomControls?.classList.remove('right-105');
      if (!isMobile) {
        handleResetZoom();
      }
    }
  }, [selectedBarangay, isMobile]);

  const currentLatestPopulation =
    selectedBarangay?.history.slice(-1)[0].population;

  return (
    <div className='flex h-screen bg-kapwa-gray-50'>
      {/* Interactive Leaflet Segment */}
      <div className='flex-1 relative'>
        {/* Overlay Navigation & Filters */}
        <div className='absolute top-4 left-4 right-4 z-5 max-w-md flex flex-row gap-4'>
          <div>
            <Link
              to='/'
              className='group flex items-center justify-center bg-kapwa-blue-500 rounded-lg p-2 border-2 border-kapwa-bg-surface text-kapwa-text-inverse font-bold transition-all duration-300 ease-in-out hover:pr-4 shadow-md active:scale-95'
              title='Back to Home'
            >
              <House className='h-6 w-6' />
              <span className='max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:ml-2'>
                Go back home
              </span>
            </Link>
          </div>
          <div className='relative flex-1'>
            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-kapwa-text-inverse-subtle h-5 w-5' />
            <input
              type='text'
              placeholder='Search Taytay barangays...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 bg-kapwa-bg-surface border border-kapwa-border-brand rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-kapwa-bg-brand-active'
            />
          </div>
        </div>

        {/* Floating Custom Scale Control Stack */}
        <div
          id='zoom-controls'
          className='absolute bottom-5 right-4 z-10 flex flex-col gap-3'
        >
          <Button
            variant='primary'
            size='sm'
            onClick={handleResetZoom}
            aria-label='Reset zoom'
          >
            <RefreshCcwIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={handleZoomIn}
            aria-label='Zoom in'
          >
            <ZoomInIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={handleZoomOut}
            aria-label='Zoom out'
          >
            <ZoomOutIcon className='h-4 w-4' />
          </Button>
        </div>

        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          ref={mapRef}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          className='z-0'
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {mapData && mapData.features && (
            <GeoJSON
              key={searchQuery}
              ref={geoJsonLayerRef}
              data={mapData}
              style={barangayStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>

        {hoveredBarangayName && (
          <div
            className='hidden md:block fixed pointer-events-none bg-kapwa-bg-gray-hover border border-kapwa-bg-info-hover px-4 py-2 rounded-md shadow-md z-9999'
            style={{
              left: `${mousePos.x + 20}px`,
              top: `${mousePos.y + 10}px`,
            }}
          >
            <p className='text-sm font-semibold text-kapwa-text-accent-blue whitespace-nowrap'>
              Brgy. {hoveredBarangayName}
            </p>
          </div>
        )}
      </div>

      {/* Contextual Slide-out Information Dashboard */}
      {selectedBarangay && (
        <div
          className={`absolute right-0 top-20px h-full w-full md:w-100 bg-kapwa-bg-surface shadow-xl z-10 transition-transform duration-300 ${
            selectedBarangay ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className='h-full flex flex-col'>
            <div className='p-6 border-b'>
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <h2 className='text-2xl font-bold text-kapwa-text-support'>
                    Brgy. {selectedBarangay.name}
                  </h2>
                  <p className='text-sm text-kapwa-text-on-disabled mt-1 mb-4'>
                    Taytay, Rizal Administrative Sector
                  </p>

                  <div className='flex flex-wrap gap-3'>
                    <div
                      className='flex items-center gap-2 bg-kapwa-blue-50 px-3 py-1.5 rounded-full cursor-help group relative'
                      title='Total Population'
                    >
                      <UsersIcon className='h-4 w-4 text-kapwa-text-brand' />
                      <span className='text-sm font-medium text-kapwa-text-accent-blue'>
                        {currentLatestPopulation
                          ? `${currentLatestPopulation.toLocaleString('en-PH')} (Latest)`
                          : 'No Data'}
                      </span>
                      {/* Tooltip */}
                      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-kapwa-gray-900 text-kapwa-text-inverse text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
                        Total Population (2024)
                        <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-kapwa-gray-900'></div>
                      </div>
                    </div>
                    <div
                      className='flex items-center gap-2 bg-kapwa-purple-50 px-3 py-1.5 rounded-full cursor-help group relative'
                      title='Land Area'
                    >
                      <MapPinIcon className='h-4 w-4 text-kapwa-purple-600' />
                      <span className='text-sm font-medium text-kapwa-purple-700'>
                        Area: 1.2 km²
                      </span>
                      {/* Tooltip */}
                      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-kapwa-gray-900 text-kapwa-text-inverse text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
                        Land Area (km²)
                        <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-kapwa-gray-900'></div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type='button'
                  onClick={() => setSelectedBarangay(null)}
                  className='text-kapwa-text-inverse-subtle hover:text-kapwa-text-support'
                  aria-label='Close details'
                >
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            </div>
            <ScrollArea className='flex-1'>
              <div className='p-6 space-y-6'>
                {/* Static Context Overview Snippet */}
                <div>
                  <div className='flex justify-between items-center mb-2'>
                    <h3 className='text-lg font-semibold text-kapwa-gray-900'>
                      Overview
                    </h3>
                    <a
                      href={`https://www.philatlas.com/luzon/r04a/rizal/taytay/${selectedBarangay.id}.html`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-kapwa-text-link hover:text-kapwa-text-link-hover hover:underline transition-colors duration-200 flex items-center gap-1'
                    >
                      PhilAtlas Sheet
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
                  <p className='leading-relaxed text-kapwa-text-support'>
                    {selectedBarangay.name} is an official administrative ward
                    in the municipality of Taytay, Rizal.
                    {currentLatestPopulation &&
                      ` As of our latest indicators, it houses a community of ${currentLatestPopulation.toLocaleString('en-PH')} residents.`}
                  </p>
                </div>

                <div>
                  {/* Historical Census Timeline Data Graph / List */}
                  {selectedBarangay.history &&
                    selectedBarangay.history.length > 0 && (
                      <div className='flex flex-col gap-4'>
                        <div className='flex-row flex items-center gap-2'>
                          <h3 className='text-lg font-semibold text-kapwa-gray-900'>
                            Historical Growth Metrics
                          </h3>
                          <TrendingUpIcon className='h-4 w-4 text-kapwa-bg-brand' />
                        </div>
                        <div className='border border-kapwa-gray-900 rounded-lg overflow-hidden divide-y divide-kapwa-border-strong'>
                          {selectedBarangay.history.map(record => (
                            <div
                              key={record.year}
                              className='flex justify-between items-center p-3 text-sm leading-relaxed bg-kapwa-bg-surface-brand-active hover:bg-kapwa-bg-surface-brand transition-colors'
                            >
                              <span>Census Year {record.year}</span>
                              <span>
                                {record.population.toLocaleString('en-PH')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaytayMapPortal;
