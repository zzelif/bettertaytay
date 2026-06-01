import { FC, useState } from 'react';

import {
  Church,
  ForkKnifeCrossed,
  LucideIcon,
  Shirt,
  SparklesIcon,
  ToolCase,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/Card';

import highlightsData from '@/data/about/highlights.json';
import holidayData from '@/data/discover/holiday.json';

const ICON_MAP: Record<string, LucideIcon> = {
  Shirt,
  ToolCase,
  ForkKnifeCrossed,
  Church,
  SparklesIcon,
};

const CulturePage: FC = () => {
  const [holidayFilter, setHolidayFilter] = useState<
    'all' | 'regular' | 'special'
  >('all');

  const filteredHolidays = holidayData.nationalHolidays.filter(holiday => {
    if (holidayFilter === 'all') return true;
    return holiday.type === holidayFilter;
  });

  return (
    <div className='animate-in fade-in duration-500'>
      {/* Page Header */}
      <div className='border-kapwa-border-weak mb-8 border-b pb-6'>
        <h2 className='text-kapwa-text-strong kapwa-heading-lg mb-2 font-extrabold tracking-tight'>
          Culture & Festivals
        </h2>
        <p className='text-kapwa-text-support max-w-2xl text-sm leading-relaxed'>
          Taytay&apos;s cultural identity is woven from centuries of faith,
          craftsmanship, and community — from its patron saint festivities to
          its thriving garment industry.
        </p>
      </div>

      {/* Cultural Highlights */}
      <section className='mb-10'>
        <h3 className='text-kapwa-text-strong mb-4 text-lg font-bold'>
          Cultural Identity
        </h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {highlightsData.map((item, idx) => {
            const Icon = ICON_MAP[item.icon] || SparklesIcon;

            return (
              <div
                key={idx}
                className='animate-in fade-in slide-in-from-left-4 duration-300'
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <Card
                  hover
                  className='border-kapwa-border-weak bg-kapwa-bg-surface shadow-sm transition-all hover:border-kapwa-border-brand'
                >
                  <CardContent className='p-5'>
                    <div className='flex items-start gap-4'>
                      <div className='bg-kapwa-bg-surface-brand text-kapwa-text-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm'>
                        <Icon className='h-5 w-5' />
                      </div>
                      <div>
                        <h4 className='text-kapwa-text-strong text-sm font-bold leading-tight'>
                          {item.title}
                        </h4>
                        <p className='text-kapwa-text-support mt-2 text-xs leading-relaxed'>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* Local Festivals — Hero Treatment */}
      <section className='mb-10'>
        <h3 className='text-kapwa-text-strong mb-4 text-lg font-bold'>
          Local Festivals & Celebrations
        </h3>

        {/* Featured Fiesta — Full-width card */}
        {holidayData.localFestivals.length > 0 && (
          <div className='mb-4'>
            <Card variant='featured' className='overflow-hidden'>
              <CardContent className='relative p-6'>
                <span className='text-kapwa-text-brand mb-1.5 inline-block text-[10px] font-bold tracking-widest uppercase'>
                  {holidayData.localFestivals[0].date} •{' '}
                  {holidayData.localFestivals[0].type}
                </span>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
                  <div>
                    <h4 className='text-kapwa-text-strong mb-2 text-lg font-extrabold tracking-tight'>
                      {holidayData.localFestivals[0].name}
                    </h4>
                    <p className='text-kapwa-text-support text-sm leading-relaxed'>
                      {holidayData.localFestivals[0].description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other festivals */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {holidayData.localFestivals.slice(1).map((festival, idx) => (
            <Card
              key={idx}
              hover
              className='border-kapwa-border-weak bg-kapwa-bg-surface flex flex-col justify-between shadow-sm transition-all hover:border-kapwa-border-brand'
            >
              <CardContent className='flex flex-col p-5 h-full justify-between'>
                <div>
                  <span className='text-kapwa-text-brand mb-1.5 inline-block text-[10px] font-bold tracking-widest uppercase'>
                    {festival.date} • {festival.type}
                  </span>
                  <h4 className='text-kapwa-text-strong mb-2 text-sm font-bold leading-snug'>
                    {festival.name}
                  </h4>
                  <p className='text-kapwa-text-support text-xs leading-relaxed'>
                    {festival.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* National Holidays — Compact List */}
      <section className='mb-10'>
        <div className='mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
          <h3 className='text-kapwa-text-strong text-lg font-bold mb-0'>
            Philippine National Holidays
          </h3>

          {/* Interactive Tab Switcher */}
          <div className='bg-kapwa-bg-surface-raised flex rounded-lg p-1 border border-kapwa-border-weak self-start sm:self-auto'>
            {(['all', 'regular', 'special'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setHolidayFilter(tab)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all capitalize cursor-pointer ${
                  holidayFilter === tab
                    ? 'bg-kapwa-bg-surface text-kapwa-text-brand shadow-sm border border-kapwa-border-weak font-bold'
                    : 'text-kapwa-text-support hover:text-kapwa-text-strong'
                }`}
              >
                {tab === 'all' ? 'All' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Holidays List */}
        <div className='border-kapwa-border-weak bg-kapwa-bg-surface rounded-xl border p-2 shadow-sm'>
          <div className='divide-kapwa-border-weak divide-y px-4'>
            {filteredHolidays.map((holiday, idx) => (
              <div
                key={idx}
                className='flex flex-col gap-1 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4'
              >
                <div className='flex items-start gap-4 min-w-0 flex-1'>
                  <span className='text-kapwa-text-brand w-24 shrink-0 text-xs font-semibold pt-0.5'>
                    {holiday.date}
                  </span>
                  <div className='min-w-0 flex-1'>
                    <h4 className='text-kapwa-text-strong text-sm font-bold leading-tight'>
                      {holiday.name}
                    </h4>
                    {holiday.description && (
                      <p className='text-kapwa-text-disabled mt-1 text-xs leading-relaxed'>
                        {holiday.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className='mt-1 shrink-0 sm:mt-0 pl-28 sm:pl-0'>
                  <span
                    className={`inline-block text-[9px] font-bold tracking-widest uppercase rounded-full px-2.5 py-0.5 border ${
                      holiday.type === 'regular'
                        ? 'bg-kapwa-bg-surface-brand text-kapwa-text-brand border-kapwa-border-brand-soft'
                        : 'bg-kapwa-bg-surface-raised text-kapwa-text-disabled border-kapwa-border-weak'
                    }`}
                  >
                    {holiday.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Navigation */}
      <div className='border-kapwa-border-weak grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-2'>
        <Link to='/discover/history' state={{ scrollToContent: true }}>
          <Card
            hover
            className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:border-kapwa-border-brand transition-all'
          >
            <CardContent className='flex items-center justify-between p-5'>
              <div className='flex items-center gap-3'>
                <div>
                  <h4 className='text-kapwa-text-strong text-sm font-bold'>
                    Historical Timeline
                  </h4>
                </div>
              </div>
              <ArrowRight className='text-kapwa-text-disabled h-4 w-4' />
            </CardContent>
          </Card>
        </Link>
        <Link to='/discover/tourism' state={{ scrollToContent: true }}>
          <Card
            hover
            className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:border-kapwa-border-brand transition-all'
          >
            <CardContent className='flex items-center justify-between p-5'>
              <div className='flex items-center gap-3'>
                <div>
                  <h4 className='text-kapwa-text-strong text-sm font-bold'>
                    Tourism
                  </h4>
                </div>
              </div>
              <ArrowRight className='text-kapwa-text-disabled h-4 w-4' />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default CulturePage;
