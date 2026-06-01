import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  SearchIcon,
  XIcon,
  AlertTriangleIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GlobeIcon,
  PlaneIcon,
  WalletIcon,
  BadgeCheckIcon,
  ShieldAlertIcon,
  BookOpenIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import visaData from '@/data/discover/visa.json';

interface CountryVisa {
  name: string;
  visaFree: boolean;
  allowedStay: string;
  visaType: string;
  requirements: string;
}

interface EntryRequirement {
  id: string;
  title: string;
  description: string;
  icon: string;
  link?: string;
  linkLabel?: string;
}

interface VisaInfoItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  linkLabel?: string;
}

interface VisaTypeItem {
  code: string;
  name: string;
  description: string;
  link?: string;
  linkLabel?: string;
}

interface VisaTypeCategory {
  category: string;
  description: string;
  items: VisaTypeItem[];
}

const ENTRY_ICONS: Record<string, FC<{ className?: string }>> = {
  passport: BadgeCheckIcon,
  ticket: PlaneIcon,
  globe: GlobeIcon,
  wallet: WalletIcon,
};

const VisaChecker: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'required'>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Non-Immigrant Visas');

  const filteredCountries = (visaData.countries as CountryVisa[]).filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'free' && country.visaFree) ||
      (filterType === 'required' && !country.visaFree);
    return matchesSearch && matchesFilter;
  });

  const visaFreeCount = (visaData.countries as CountryVisa[]).filter(c => c.visaFree).length;
  const visaRequiredCount = (visaData.countries as CountryVisa[]).filter(c => !c.visaFree).length;

  return (
    <div className='animate-in fade-in duration-500'>
      {/* Back to Travel Hub */}
      <Link
        to='/discover/travel'
        className='text-kapwa-text-support hover:text-kapwa-text-brand mb-6 inline-flex items-center gap-1.5 text-xs font-semibold'
      >
        <ArrowLeft className='h-3.5 w-3.5' />
        Back to Travel Hub
      </Link>

      {/* Page Header */}
      <div className='border-kapwa-border-weak mb-8 border-b pb-6'>
        <h2 className='text-kapwa-text-strong kapwa-heading-lg mb-2 font-extrabold tracking-tight'>
          Philippines Visa Information
        </h2>
        <p className='text-kapwa-text-support mt-2 max-w-2xl text-sm leading-relaxed'>
          Find out if you need a visa to visit the Philippines and learn about entry requirements.
          Official data from the Bureau of Immigration and Philippine Department of Foreign Affairs.
        </p>
        <p className='text-kapwa-text-disabled mt-1 text-xs'>
          Last Updated: {visaData.lastUpdated}
        </p>
      </div>

      {/* Legal Disclaimer */}
      <div className='border-l-4 border-l-amber-400 bg-amber-50 dark:bg-amber-950/20 text-kapwa-text-strong mb-8 flex items-start gap-3 rounded-r-xl p-4 shadow-sm'>
        <AlertTriangleIcon className='text-amber-500 h-5 w-5 shrink-0 mt-0.5' />
        <div>
          <h4 className='text-xs font-bold leading-none mb-1.5'>
            Official Disclaimer & Information Notice
          </h4>
          <p className='text-kapwa-text-support text-xs leading-relaxed'>
            {visaData.disclaimer} This page is a community-maintained information mirror and is not a substitute for official legal guidance or an immigration officer's determination.
          </p>
        </div>
      </div>

      {/* Entry Requirements Checklist */}
      <section className='mb-10'>
        <h3 className='text-kapwa-text-strong mb-1 text-lg font-bold'>
          Entry Requirements
        </h3>
        <p className='text-kapwa-text-support mb-4 text-xs leading-relaxed'>
          All visitors must meet these baseline requirements regardless of visa status.
        </p>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {(visaData.entryRequirements as EntryRequirement[]).map((req, idx) => {
            const Icon = ENTRY_ICONS[req.icon] || CheckCircle2;
            return (
              <div
                key={req.id}
                className='animate-in fade-in slide-in-from-bottom-2 duration-300'
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <Card className='border-kapwa-border-weak bg-kapwa-bg-surface shadow-sm h-full'>
                  <CardContent className='p-4 h-full flex flex-col'>
                    <div className='flex items-start gap-3 flex-1'>
                      <div className='bg-kapwa-bg-surface-brand text-kapwa-text-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-lg'>
                        <Icon className='h-4.5 w-4.5' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-kapwa-text-strong text-sm font-bold mb-1'>
                          {req.title}
                        </h4>
                        <p className='text-kapwa-text-support text-xs leading-relaxed'>
                          {req.description}
                        </p>
                        {req.link && (
                          <a
                            href={req.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-kapwa-text-brand hover:underline mt-2 inline-flex items-center gap-1 text-xs font-semibold'
                          >
                            {req.linkLabel}
                            <ExternalLink className='h-3 w-3' />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* Important Visa Information */}
      <section className='mb-10'>
        <h3 className='text-kapwa-text-strong mb-1 text-lg font-bold'>
          Important Visa Information
        </h3>
        <p className='text-kapwa-text-support mb-4 text-xs leading-relaxed'>
          Key visa categories and procedures for temporary visitors.
        </p>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {(visaData.importantVisaInfo as VisaInfoItem[]).map((info, idx) => (
            <div
              key={info.id}
              className='animate-in fade-in slide-in-from-bottom-2 duration-300'
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <Card className='border-kapwa-border-weak bg-kapwa-bg-surface shadow-sm h-full'>
                <CardContent className='p-5 h-full flex flex-col justify-between'>
                  <div>
                    <div className='flex items-center gap-2 mb-3'>
                      <div className='bg-kapwa-bg-surface-brand text-kapwa-text-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-lg'>
                        <FileTextIcon className='h-4 w-4' />
                      </div>
                      <h4 className='text-kapwa-text-strong text-sm font-bold leading-tight'>
                        {info.title}
                      </h4>
                    </div>
                    <p className='text-kapwa-text-support text-xs leading-relaxed'>
                      {info.description}
                    </p>
                  </div>
                  {info.link && (
                    <a
                      href={info.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-kapwa-text-brand hover:underline mt-4 inline-flex items-center gap-1 text-xs font-semibold'
                    >
                      {info.linkLabel}
                      <ExternalLink className='h-3 w-3' />
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Visa Country Checker */}
      <section className='mb-10'>
        <h3 className='text-kapwa-text-strong mb-1 text-lg font-bold'>
          Visa Exemption Checker
        </h3>
        <p className='text-kapwa-text-support mb-4 text-xs leading-relaxed'>
          Search your passport country to find out your visa status when entering the Philippines.
        </p>

        {/* Summary Stats */}
        <div className='grid grid-cols-2 gap-3 mb-5'>
          <div className='bg-kapwa-bg-surface-brand border border-kapwa-border-brand-soft rounded-xl p-3 text-center'>
            <div className='text-kapwa-text-brand text-xl font-extrabold'>{visaFreeCount}</div>
            <div className='text-kapwa-text-brand text-[10px] font-semibold tracking-widest uppercase mt-0.5'>Visa-Free Countries</div>
          </div>
          <div className='bg-kapwa-bg-surface-raised border border-kapwa-border-weak rounded-xl p-3 text-center'>
            <div className='text-kapwa-text-strong text-xl font-extrabold'>{visaRequiredCount}</div>
            <div className='text-kapwa-text-disabled text-[10px] font-semibold tracking-widest uppercase mt-0.5'>Visa Required</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className='border-kapwa-border-weak mb-5 rounded-xl border bg-kapwa-bg-surface-raised p-4 shadow-sm'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <div className='relative flex-1'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <SearchIcon className='text-kapwa-text-disabled h-4 w-4' />
              </div>
              <input
                type='text'
                placeholder='Search your passport country...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='border-kapwa-border-weak bg-kapwa-bg-surface focus:ring-kapwa-border-brand focus:border-kapwa-border-brand block w-full rounded-lg border py-2 pr-10 pl-10 text-sm leading-5 focus:ring-1 focus:outline-none'
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className='text-kapwa-text-disabled hover:text-kapwa-text-support absolute inset-y-0 right-0 flex items-center pr-3'
                >
                  <XIcon className='h-4 w-4' />
                </button>
              )}
            </div>

            <div className='bg-kapwa-bg-surface flex rounded-lg p-1 border border-kapwa-border-weak shrink-0 self-start sm:self-auto'>
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'free', label: 'Visa-Free' },
                  { id: 'required', label: 'Visa Required' },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-kapwa-bg-surface-raised text-kapwa-text-brand shadow-sm border border-kapwa-border-weak font-bold'
                      : 'text-kapwa-text-support hover:text-kapwa-text-strong'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          {filteredCountries.map((country, index) => (
            <Card
              key={index}
              className='border-kapwa-border-weak bg-kapwa-bg-surface shadow-sm transition-all hover:border-kapwa-border-brand'
            >
              <CardContent className='p-4'>
                <div className='mb-2 flex items-start justify-between gap-4'>
                  <div>
                    <h4 className='text-kapwa-text-strong text-sm font-bold leading-tight'>
                      {country.name}
                    </h4>
                    <span className='text-kapwa-text-disabled mt-0.5 inline-block text-[10px] font-bold tracking-widest uppercase'>
                      {country.visaType}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 shrink-0 border text-[9px] font-bold tracking-widest uppercase ${
                      country.visaFree
                        ? 'bg-kapwa-bg-surface-brand text-kapwa-text-brand border-kapwa-border-brand-soft'
                        : 'bg-kapwa-bg-surface-raised text-kapwa-text-disabled border-kapwa-border-weak'
                    }`}
                  >
                    {country.visaFree ? (
                      <CheckCircle2 className='h-2.5 w-2.5' />
                    ) : (
                      <ShieldAlertIcon className='h-2.5 w-2.5' />
                    )}
                    {country.visaFree ? 'Visa-Free' : 'Visa Required'}
                  </div>
                </div>

                <div className='space-y-2 border-t border-kapwa-border-weak pt-2.5'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-kapwa-text-support font-semibold'>Allowed Stay:</span>
                    <span className='text-kapwa-text-strong font-bold'>{country.allowedStay}</span>
                  </div>
                  <div className='text-xs'>
                    <p className='text-kapwa-text-disabled leading-relaxed bg-kapwa-bg-surface-raised border border-kapwa-border-weak rounded-lg p-2'>
                      {country.requirements}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCountries.length === 0 && (
          <div className='border-kapwa-border-weak bg-kapwa-bg-surface rounded-xl border p-12 text-center shadow-sm'>
            <AlertCircle className='text-kapwa-text-disabled mx-auto mb-4 h-12 w-12' />
            <h4 className='text-kapwa-text-strong text-base font-bold'>No passport matches found</h4>
            <p className='text-kapwa-text-disabled mt-1 text-sm'>
              Try typing another country name, or check your spelling.
            </p>
          </div>
        )}
      </section>

      {/* Philippines Visa Types Explorer */}
      <section className='mb-10'>
        <h3 className='text-kapwa-text-strong mb-1 text-lg font-bold'>
          Philippines Visa Types Explorer
        </h3>
        <p className='text-kapwa-text-support mb-4 text-xs leading-relaxed'>
          Explore the different types of visas available for travel to, work in, or residence in the Philippines.
        </p>

        <div className='space-y-3'>
          {(visaData.visaTypes as VisaTypeCategory[]).map(cat => (
            <div
              key={cat.category}
              className='border-kapwa-border-weak rounded-xl border bg-kapwa-bg-surface overflow-hidden shadow-sm'
            >
              {/* Category Header (accordion toggle) */}
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === cat.category ? null : cat.category
                  )
                }
                className='w-full flex items-center justify-between px-5 py-4 text-left hover:bg-kapwa-bg-hover transition-colors cursor-pointer'
              >
                <div className='flex items-center gap-3'>
                  <div className='bg-kapwa-bg-surface-brand text-kapwa-text-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-lg'>
                    <BookOpenIcon className='h-4 w-4' />
                  </div>
                  <div>
                    <h4 className='text-kapwa-text-strong text-sm font-bold leading-tight'>
                      {cat.category}
                    </h4>
                    <p className='text-kapwa-text-disabled text-[10px] mt-0.5'>{cat.description}</p>
                  </div>
                </div>
                {expandedCategory === cat.category ? (
                  <ChevronDownIcon className='text-kapwa-text-disabled h-4 w-4 shrink-0 transition-transform' />
                ) : (
                  <ChevronRightIcon className='text-kapwa-text-disabled h-4 w-4 shrink-0 transition-transform' />
                )}
              </button>

              {/* Expanded Visa Items */}
              {expandedCategory === cat.category && (
                <div className='border-t border-kapwa-border-weak divide-y divide-kapwa-border-weak'>
                  {cat.items.map(item => (
                    <div key={item.code} className='px-5 py-4'>
                      <div className='flex items-start gap-3'>
                        <span className='text-kapwa-text-brand bg-kapwa-bg-surface-brand rounded-md px-2 py-0.5 text-[10px] font-extrabold tracking-widest uppercase shrink-0 mt-0.5'>
                          {item.code}
                        </span>
                        <div className='flex-1 min-w-0'>
                          <h5 className='text-kapwa-text-strong text-xs font-bold mb-1'>
                            {item.name}
                          </h5>
                          <p className='text-kapwa-text-support text-xs leading-relaxed'>
                            {item.description}
                          </p>
                          {item.link && (
                            <a
                              href={item.link}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-kapwa-text-brand hover:underline mt-2 inline-flex items-center gap-1 text-xs font-semibold'
                            >
                              {item.linkLabel}
                              <ExternalLink className='h-3 w-3' />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Official Resources */}
      <div className='border-kapwa-border-weak bg-kapwa-bg-surface-raised rounded-xl border p-5 shadow-sm'>
        <h4 className='text-kapwa-text-strong text-sm font-bold mb-3'>Official Resources</h4>
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
          {[
            {
              label: 'Bureau of Immigration',
              url: 'https://immigration.gov.ph',
            },
            {
              label: 'Dept. of Foreign Affairs',
              url: 'https://dfa.gov.ph',
            },
            {
              label: 'e-Travel Portal',
              url: 'https://etravel.gov.ph',
            },
          ].map(link => (
            <a
              key={link.url}
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-between border-kapwa-border-weak bg-kapwa-bg-surface hover:bg-kapwa-bg-hover hover:border-kapwa-border-brand rounded-lg border px-3.5 py-2.5 text-xs font-semibold text-kapwa-text-strong transition-all'
            >
              {link.label}
              <ExternalLink className='text-kapwa-text-disabled h-3 w-3 shrink-0' />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisaChecker;
