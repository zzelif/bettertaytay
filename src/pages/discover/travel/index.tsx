import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CloudSunIcon,
  DollarSignIcon,
  FlagIcon,
  InfoIcon,
  PhoneIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const TravelIndex: FC = () => {
  return (
    <div className='animate-in fade-in duration-500'>
      {/* Page Header */}
      <div className='border-kapwa-border-weak mb-8 border-b pb-6'>
        <h2 className='text-kapwa-text-strong kapwa-heading-lg mb-2 font-extrabold tracking-tight'>
          Travel Hub
        </h2>
        <p className='text-kapwa-text-support max-w-2xl text-sm leading-relaxed'>
          Essential resources for travelers visiting the Municipality of Taytay,
          Rizal, and the Philippines — from immigration requirements to local
          utilities.
        </p>
      </div>

      {/* Main Visa Tools Card */}
      <div className='mb-8'>
        <Link to='/discover/travel/visa'>
          <Card
            hover
            className='border-kapwa-border-weak bg-kapwa-bg-surface hover:border-kapwa-border-brand transition-all'
          >
            <CardContent className='p-6'>
              <div className='flex flex-col justify-between sm:flex-row sm:items-center gap-4'>
                <div className='flex items-start gap-4'>
                  <div>
                    <h3 className='text-kapwa-text-strong text-base font-bold mb-1'>
                      Philippines Visa & Entry Checker
                    </h3>
                    <p className='text-kapwa-text-support text-xs leading-relaxed max-w-xl'>
                      Check tourist visa exemptions, stay periods, visa types,
                      and extension procedures for foreign passport holders
                      entering the Philippines.
                    </p>
                  </div>
                </div>
                <div className='text-kapwa-text-brand flex items-center gap-1.5 text-xs font-semibold shrink-0 pl-14 sm:pl-0'>
                  Open Visa Portal
                  <ArrowRight className='h-3.5 w-3.5' />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Muted Travel Utilities */}
      <section className='mb-8'>
        <h3 className='text-kapwa-text-strong text-sm font-bold mb-3'>
          Related Utilities
        </h3>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          <Link to='/data/weather'>
            <div className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:bg-kapwa-bg-hover flex items-center justify-between rounded-xl border p-3.5 transition-all'>
              <div className='flex items-center gap-3'>
                <CloudSunIcon className='text-kapwa-text-brand h-4 w-4' />
                <span className='text-kapwa-text-strong text-xs font-semibold'>
                  Local Weather
                </span>
              </div>
              <ArrowRight className='text-kapwa-text-disabled h-3.5 w-3.5' />
            </div>
          </Link>
          <Link to='/data/forex'>
            <div className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:bg-kapwa-bg-hover flex items-center justify-between rounded-xl border p-3.5 transition-all'>
              <div className='flex items-center gap-3'>
                <DollarSignIcon className='text-kapwa-text-brand h-4 w-4' />
                <span className='text-kapwa-text-strong text-xs font-semibold'>
                  Forex Exchange
                </span>
              </div>
              <ArrowRight className='text-kapwa-text-disabled h-3.5 w-3.5' />
            </div>
          </Link>
          <Link to='/hotlines'>
            <div className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:bg-kapwa-bg-hover flex items-center justify-between rounded-xl border p-3.5 transition-all'>
              <div className='flex items-center gap-3'>
                <PhoneIcon className='text-kapwa-text-brand h-4 w-4' />
                <span className='text-kapwa-text-strong text-xs font-semibold'>
                  Emergency Hotlines
                </span>
              </div>
              <ArrowRight className='text-kapwa-text-disabled h-3.5 w-3.5' />
            </div>
          </Link>
        </div>
      </section>

      {/* Warning Disclaimer Box */}
      <div className='border-kapwa-border-weak bg-kapwa-bg-surface-raised flex items-start gap-3 rounded-xl border p-4 shadow-sm'>
        <InfoIcon className='text-kapwa-text-disabled h-5 w-5 shrink-0 mt-0.5' />
        <div>
          <h4 className='text-kapwa-text-strong text-xs font-bold leading-none mb-1.5'>
            Travel Notice & Disclaimer
          </h4>
          <p className='text-kapwa-text-disabled text-xs leading-relaxed'>
            Immigration guidelines, currency rates, and municipal announcements
            can shift rapidly. This travel portal is a community-managed
            information mirror. Visas and travel credentials must always be
            officially confirmed through the Bureau of Immigration (BI) or the
            Department of Foreign Affairs (DFA) before booking your travels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TravelIndex;
