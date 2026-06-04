import { FC, useState } from 'react';

import {
  ChurchIcon,
  LucideIcon,
  MapPinIcon,
  SearchIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TreesIcon,
  UtensilsIcon,
  WavesIcon,
  StarIcon,
  ArrowRight,
  XIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/Card';
import { ModuleHeader } from '@/components/layout';
import { config } from '@/lib/lguConfig';

import tourismData from '@/data/discover/tourism.json';

// Category config
interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  tokenColor: string;
  tokenBg: string;
}

const CATEGORIES: Record<string, CategoryConfig> = {
  heritage: {
    label: 'Heritage',
    icon: ChurchIcon,
    tokenColor: 'text-kapwa-text-brand',
    tokenBg: 'bg-kapwa-bg-surface-brand',
  },
  dining: {
    label: 'Dining',
    icon: UtensilsIcon,
    tokenColor: 'text-kapwa-text-warning',
    tokenBg: 'bg-kapwa-bg-warning-weak',
  },
  shopping: {
    label: 'Shopping',
    icon: ShoppingBagIcon,
    tokenColor: 'text-kapwa-text-accent-purple',
    tokenBg: 'bg-kapwa-bg-accent-purple-weak',
  },
  recreation: {
    label: 'Recreation',
    icon: WavesIcon,
    tokenColor: 'text-kapwa-text-success',
    tokenBg: 'bg-kapwa-bg-success-weak',
  },
  nature: {
    label: 'Nature',
    icon: TreesIcon,
    tokenColor: 'text-kapwa-text-success',
    tokenBg: 'bg-kapwa-bg-success-weak',
  },
};

const TourismPage: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpots = tourismData.filter(spot => {
    const matchesCategory =
      activeCategory === 'all' || spot.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredSpots = tourismData.filter(s => s.featured);
  const showFeatured = activeCategory === 'all' && !searchTerm;

  // Count per category
  const categoryCounts = Object.fromEntries(
    Object.keys(CATEGORIES).map(key => [
      key,
      tourismData.filter(s => s.category === key).length,
    ])
  );

  return (
    <div className='animate-in fade-in duration-500'>
      {/* Page Header */}
      <ModuleHeader
        title='Tourism & Attractions'
        description={`Discover what makes ${config.lgu.name} special — from centuries-old churches and bustling garment markets to local delicacies and family-friendly resorts.`}
      />

      {/* Featured Spots — Only when showing "All" with no search */}
      {showFeatured && (
        <section className='mb-8'>
          <h3 className='text-kapwa-text-strong mb-4 text-lg font-bold'>
            Featured Attractions
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {featuredSpots.map((spot, idx) => {
              const cat = CATEGORIES[spot.category] || CATEGORIES.heritage;
              return (
                <div
                  key={spot.id}
                  className='animate-in fade-in slide-in-from-bottom-2 duration-300'
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <Card
                    variant='featured'
                    className='overflow-hidden transition-all'
                  >
                    <CardContent className='p-5'>
                      <div className='mb-2 flex items-start justify-between gap-4'>
                        <div>
                          <span className='text-kapwa-text-brand mb-1 inline-block text-[10px] font-bold tracking-widest uppercase'>
                            {cat.label}
                          </span>
                          <h4 className='text-kapwa-text-strong text-base font-extrabold tracking-tight leading-tight'>
                            {spot.name}
                          </h4>
                        </div>
                        <div className='flex items-center gap-1 bg-kapwa-bg-surface-raised border border-kapwa-border-weak rounded-full px-2.5 py-0.5 mt-0.5 shrink-0'>
                          <StarIcon className='text-kapwa-text-warning h-3 w-3' />
                          <span className='text-kapwa-text-support text-[9px] font-bold tracking-widest uppercase'>
                            Featured
                          </span>
                        </div>
                      </div>
                      <p className='text-kapwa-text-support mb-4 text-xs leading-relaxed'>
                        {spot.description}
                      </p>
                      <div className='flex items-center gap-1.5 text-xs'>
                        <MapPinIcon className='text-kapwa-text-disabled h-3.5 w-3.5 shrink-0' />
                        <span className='text-kapwa-text-disabled'>
                          {spot.address}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Search & Filter Bar */}
      <div className='border-kapwa-border-weak mb-6 rounded-xl border bg-kapwa-bg-surface-raised p-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          {/* Search */}
          <div className='relative flex-1'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <SearchIcon className='text-kapwa-text-disabled h-4 w-4' />
            </div>
            <input
              type='text'
              placeholder='Search spots, restaurants, landmarks...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='border-kapwa-border-weak bg-kapwa-bg-surface focus:ring-kapwa-border-brand focus:border-kapwa-border-brand block w-full rounded-lg border py-2 pr-10 pl-10 text-sm leading-5 focus:ring-1 focus:outline-none'
            />
            {searchTerm && (
              <button
                title='Clear search'
                onClick={() => setSearchTerm('')}
                className='text-kapwa-text-disabled hover:text-kapwa-text-support absolute inset-y-0 right-0 flex items-center pr-3'
              >
                <XIcon className='h-4 w-4' />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className='flex flex-wrap gap-1.5'>
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-kapwa-bg-brand-default text-kapwa-text-inverse shadow-sm'
                  : 'bg-kapwa-bg-surface text-kapwa-text-support hover:bg-kapwa-bg-hover'
              }`}
            >
              All ({tourismData.length})
            </button>
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const Icon = cat.icon;
              const count = categoryCounts[key] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === key
                      ? 'bg-kapwa-bg-brand-default text-kapwa-text-inverse shadow-sm'
                      : 'bg-kapwa-bg-surface text-kapwa-text-support hover:bg-kapwa-bg-hover'
                  }`}
                >
                  <Icon className='h-3.5 w-3.5' />
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className='mb-4'>
        <p className='text-kapwa-text-disabled text-xs font-semibold tracking-wider uppercase'>
          {filteredSpots.length} {filteredSpots.length === 1 ? 'spot' : 'spots'}{' '}
          found
          {activeCategory !== 'all' &&
            ` in ${CATEGORIES[activeCategory]?.label}`}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Results Grid */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {filteredSpots.map((spot, idx) => {
          const cat = CATEGORIES[spot.category] || CATEGORIES.heritage;
          return (
            <div
              key={spot.id}
              className='animate-in fade-in duration-300'
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <Card
                hover
                className='border-kapwa-border-weak bg-kapwa-bg-surface flex flex-col justify-between shadow-sm transition-all hover:border-kapwa-border-brand'
              >
                <CardContent className='flex flex-col p-5 h-full justify-between'>
                  <div>
                    <div className='mb-2 flex items-start justify-between gap-4'>
                      <div>
                        <span className='text-kapwa-text-brand mb-1 inline-block text-[10px] font-bold tracking-widest uppercase'>
                          {cat.label}
                        </span>
                        <h4 className='text-kapwa-text-strong text-sm font-bold leading-tight'>
                          {spot.name}
                        </h4>
                      </div>
                      {spot.featured && (
                        <div className='flex items-center gap-1 bg-kapwa-bg-surface-brand border border-kapwa-border-brand-soft rounded-full px-2 py-0.5 shrink-0'>
                          <StarIcon className='text-kapwa-text-brand h-2.5 w-2.5' />
                          <span className='text-kapwa-text-brand text-[8px] font-bold tracking-widest uppercase'>
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <p className='text-kapwa-text-support mb-4 text-xs leading-relaxed'>
                      {spot.description}
                    </p>
                  </div>
                  <div>
                    <div className='flex items-center gap-1.5 text-xs'>
                      <MapPinIcon className='text-kapwa-text-disabled h-3.5 w-3.5 shrink-0' />
                      <span className='text-kapwa-text-disabled truncate'>
                        {spot.address}
                      </span>
                    </div>
                    {/* Tags */}
                    {spot.tags.length > 0 && (
                      <div className='mt-3 flex flex-wrap gap-1.5'>
                        {spot.tags.slice(0, 4).map(tag => (
                          <span
                            key={tag}
                            className='bg-kapwa-bg-surface-raised text-kapwa-text-disabled rounded-full px-2 py-0.5 text-[9px] font-medium border border-kapwa-border-weak'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSpots.length === 0 && (
        <div className='py-16 text-center'>
          <SparklesIcon className='text-kapwa-text-disabled mx-auto mb-4 h-12 w-12' />
          <h3 className='text-kapwa-text-strong text-lg font-bold'>
            No spots found
          </h3>
          <p className='text-kapwa-text-disabled mt-1 text-sm'>
            Try adjusting your search or category filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
            }}
            className='text-kapwa-text-brand mt-3 text-sm font-semibold hover:underline'
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Cross-link to Map */}
      <div className='border-kapwa-border-weak mt-10 border-t pt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Link to='/government/barangays'>
          <Card
            hover
            className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:border-kapwa-border-brand transition-all'
          >
            <CardContent className='flex items-center justify-between p-5'>
              <span className='text-kapwa-text-strong text-sm font-semibold'>
                Barangays
              </span>
              <ArrowRight className='text-kapwa-text-disabled h-4 w-4' />
            </CardContent>
          </Card>
        </Link>
        <Link to='/discover/map'>
          <Card
            hover
            className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:border-kapwa-border-brand transition-all'
          >
            <CardContent className='flex items-center justify-between p-5'>
              <span className='text-kapwa-text-strong text-sm font-semibold'>
                Interactive Map
              </span>
              <ArrowRight className='text-kapwa-text-disabled h-4 w-4' />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default TourismPage;
