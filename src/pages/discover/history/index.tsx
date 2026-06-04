import { FC, useState } from 'react';

import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@bettergov/kapwa/button';
import { Card, CardContent } from '@/components/ui/Card';
import { ModuleHeader } from '@/components/layout';

import { config } from '@/lib/lguConfig';

import historyData from '@/data/about/history.json';

const HistoryPage: FC = () => {
  const [showAll, setShowAll] = useState(false);
  const COLLAPSE_LIMIT = 8;

  const visibleHistory = showAll
    ? historyData
    : historyData.slice(0, COLLAPSE_LIMIT);

  return (
    <div className='animate-in fade-in duration-500'>
      {/* Page Header */}
      <ModuleHeader
        title={`History of ${config.lgu.name}`}
        description={`From its origins in the pre-Hispanic Kingdom of Namayan to its modern identity as the Garments Capital of the Philippines, ${config.lgu.name}'s history spans centuries of resilience, faith, and enterprise.`}
      />

      {/* Quick Stats */}
      <div className='mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {[
          { label: 'Founded', value: 'Pre-1579', accent: 'brand' },
          { label: 'Barangays', value: '5', accent: 'brand' },
          { label: 'Province', value: 'Rizal', accent: 'brand' },
          { label: 'Region', value: 'IV-A', accent: 'brand' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className='bg-kapwa-bg-surface-raised border-kapwa-border-weak animate-in fade-in rounded-xl border p-3.5 text-center shadow-sm duration-300'
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <p className='text-kapwa-text-disabled text-[10px] font-bold tracking-widest uppercase'>
              {stat.label}
            </p>
            <p className='text-kapwa-text-strong mt-1 text-lg font-extrabold tracking-tight'>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className='relative'>
        {/* Vertical line */}
        <div className='border-kapwa-border-brand absolute top-2 bottom-0 left-4 w-0.5 border-l-2' />

        <div className='space-y-6'>
          {visibleHistory.map((event, idx) => (
            <div
              key={idx}
              className='animate-in fade-in slide-in-from-left-4 group relative pl-12 duration-300'
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Dot Marker — matches TimelineSection exactly */}
              <div className='absolute left-0 top-3 flex h-8 w-8 items-center justify-center'>
                <div className='border-kapwa-border-brand bg-kapwa-bg-surface group-hover:bg-kapwa-bg-brand-default h-3 w-3 rounded-full border-2 shadow-sm transition-all duration-300 group-hover:scale-125' />
              </div>

              <Card className='border-kapwa-border-weak shadow-sm transition-all hover:shadow-md hover:border-kapwa-border-brand'>
                <CardContent className='flex flex-col items-start gap-4 p-4 sm:flex-row sm:p-5'>
                  <span className='bg-kapwa-bg-brand-default text-kapwa-text-inverse inline-flex shrink-0 items-center justify-center rounded-lg px-3 py-1 text-xs font-bold shadow-sm'>
                    {event.year}
                  </span>
                  <div>
                    <h3 className='text-kapwa-text-strong mb-1 text-base font-bold leading-tight'>
                      {event.title}
                    </h3>
                    <p className='text-kapwa-text-support text-xs leading-relaxed sm:text-sm'>
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Show More / Show Less */}
      {historyData.length > COLLAPSE_LIMIT && (
        <div className='mt-8 flex justify-center'>
          <Button
            variant='primary'
            onClick={() => setShowAll(!showAll)}
            className='bg-kapwa-bg-surface text-kapwa-text-brand hover:bg-kapwa-bg-surface-brand'
            rightIcon={
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
              />
            }
          >
            {showAll ? 'Show Less' : `Show All ${historyData.length} Events`}
          </Button>
        </div>
      )}

      {/* Related Navigation */}
      <div className='border-kapwa-border-weak mt-10 grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-2'>
        <Link to='/discover/culture' state={{ scrollToContent: true }}>
          <Card
            hover
            className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:border-kapwa-border-brand transition-all'
          >
            <CardContent className='flex items-center justify-between p-5'>
              <div className='flex items-center gap-3'>
                <div>
                  <h4 className='text-kapwa-text-strong text-sm font-bold'>
                    Culture & Festivals
                  </h4>
                </div>
              </div>
              <ArrowRight className='text-kapwa-text-disabled h-4 w-4' />
            </CardContent>
          </Card>
        </Link>
        <Link to='/discover/about' state={{ scrollToContent: true }}>
          <Card
            hover
            className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:border-kapwa-border-brand transition-all'
          >
            <CardContent className='flex items-center justify-between p-5'>
              <div className='flex items-center gap-3'>
                <div>
                  <h4 className='text-kapwa-text-strong text-sm font-bold'>
                    About Taytay
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

export default HistoryPage;
