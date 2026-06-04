import { FC, useState } from 'react';
import hotlinesData from '../data/philippines_hotlines.json';
import { Hotline } from '@/lib/hotline';

import {
  PhoneIcon,
  SearchIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  CloudLightningIcon,
  ShieldIcon,
  BusIcon,
  DropletIcon,
  HeartIcon,
  XIcon,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';

const Hotlines: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    {
      id: 'all',
      name: 'All Hotlines',
      icon: <PhoneIcon className='w-4 h-4' />,
    },
    {
      id: 'emergency',
      name: 'Emergency',
      icon: <AlertCircleIcon className='w-4 h-4' />,
    },
    {
      id: 'disaster',
      name: 'Disaster',
      icon: <AlertTriangleIcon className='w-4 h-4' />,
    },
    {
      id: 'security',
      name: 'Security',
      icon: <ShieldIcon className='w-4 h-4' />,
    },
    {
      id: 'transport',
      name: 'Transport',
      icon: <BusIcon className='w-4 h-4' />,
    },
    {
      id: 'weather',
      name: 'Weather',
      icon: <CloudLightningIcon className='w-4 h-4' />,
    },
    {
      id: 'utility',
      name: 'Utilities',
      icon: <DropletIcon className='w-4 h-4' />,
    },
    {
      id: 'social',
      name: 'Social Services',
      icon: <HeartIcon className='w-4 h-4' />,
    },
  ];

  const getCategoryHotlines = (category: string): Hotline[] => {
    switch (category) {
      case 'emergency':
        return hotlinesData.emergencyHotlines as Hotline[];
      case 'disaster':
        return hotlinesData.disasterHotlines as Hotline[];
      case 'security':
        return hotlinesData.securityHotlines as Hotline[];
      case 'transport':
        return hotlinesData.transportHotlines as Hotline[];
      case 'weather':
        return hotlinesData.weatherHotlines as Hotline[];
      case 'utility':
        return hotlinesData.utilityHotlines as Hotline[];
      case 'social':
        return hotlinesData.socialServicesHotlines as Hotline[];
      default:
        return [
          ...hotlinesData.emergencyHotlines,
          ...hotlinesData.disasterHotlines,
          ...hotlinesData.securityHotlines,
          ...hotlinesData.transportHotlines,
          ...hotlinesData.weatherHotlines,
          ...hotlinesData.utilityHotlines,
          ...hotlinesData.socialServicesHotlines,
        ] as Hotline[];
    }
  };

  const filteredHotlines = getCategoryHotlines(activeCategory).filter(
    hotline =>
      hotline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotline.numbers.some(number => number.includes(searchTerm))
  );

  return (
    <div className='min-h-screen bg-kapwa-bg-surface'>
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center mb-8'>
          <h1 className='text-kapwa-text-strong text-3xl font-bold mb-2'>
            Philippines Emergency Hotlines
          </h1>
          <p className='text-kapwa-text-support'>
            Important contact numbers for emergencies and public services
          </p>
        </div>

        {/* Search Bar */}
        <div className='relative max-w-md mx-auto mb-8'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <SearchIcon className='h-5 w-5 text-kapwa-text-disabled' />
          </div>
          <input
            type='text'
            className='block w-full pl-10 pr-10 py-2.5 border border-kapwa-border-weak rounded-lg bg-kapwa-bg-surface shadow-sm focus:ring-kapwa-border-brand focus:border-kapwa-border-brand focus:ring-1 focus:outline-none text-sm'
            placeholder='Search for hotlines...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              title='Clear search'
              onClick={() => setSearchTerm('')}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-kapwa-text-disabled hover:text-kapwa-text-support'
            >
              <XIcon className='h-4 w-4' />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className='flex flex-wrap justify-center gap-2 mb-8'>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === category.id
                  ? 'bg-kapwa-bg-brand-default text-kapwa-text-inverse shadow-sm'
                  : 'bg-kapwa-bg-surface-raised text-kapwa-text-support hover:bg-kapwa-bg-hover'
              }`}
            >
              <span className='mr-2'>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Hotlines List */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredHotlines.length > 0 ? (
            filteredHotlines.map((hotline, index) => (
              <Card
                key={index}
                hover
                className='border-kapwa-border-weak shadow-sm transition-all'
              >
                <CardContent className='p-5'>
                  <h3 className='text-kapwa-text-strong font-bold text-base mb-2'>
                    {hotline.name}
                  </h3>
                  {hotline.description && (
                    <p className='text-kapwa-text-support text-sm mb-3'>
                      {hotline.description}
                    </p>
                  )}
                  <div className='space-y-2'>
                    {hotline.numbers.map((number, idx) => (
                      <div key={idx} className='flex items-center'>
                        <PhoneIcon className='h-4 w-4 text-kapwa-text-brand mr-2 shrink-0' />
                        <a
                          href={`tel:${number.replace(/\D/g, '')}`}
                          className='text-kapwa-text-brand hover:underline text-sm font-medium'
                        >
                          {number}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className='col-span-full text-center py-10'>
              <AlertCircleIcon className='h-12 w-12 text-kapwa-text-disabled mx-auto mb-4' />
              <h3 className='text-lg font-medium text-kapwa-text-strong'>
                No hotlines found
              </h3>
              <p className='mt-1 text-kapwa-text-support'>
                Try adjusting your search or filter.
              </p>
            </div>
          )}
        </div>

        <div className='mt-12 text-center'>
          <p className='text-sm text-kapwa-text-support'>
            These hotlines are collected from official government sources. If
            you notice any outdated information, please report it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hotlines;
