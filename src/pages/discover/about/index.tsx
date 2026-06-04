import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPinIcon,
  UsersIcon,
  ShirtIcon,
  ScissorsIcon,
  CloudSunIcon,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { ModuleHeader } from '@/components/layout';
import { lguLabels } from '@/constants/lguLabels';

// Define types
interface QuickFact {
  icon: ReactNode;
  title: string;
  description: string;
}

const AboutTaytay: FC = () => {
  const { t } = useTranslation('about-taytay');

  const facts: QuickFact[] = [
    {
      icon: <MapPinIcon className='h-6 w-6' />,
      title: t('about.facts.items.geography.title'),
      description: t('about.facts.items.geography.description'),
    },
    {
      icon: <UsersIcon className='h-6 w-6' />,
      title: t('about.facts.items.population.title'),
      description: t('about.facts.items.population.description'),
    },
    {
      icon: <ShirtIcon className='h-6 w-6' />,
      title: t('about.facts.items.industry.title'),
      description: t('about.facts.items.industry.description'),
    },
    {
      icon: <ScissorsIcon className='h-6 w-6' />,
      title: t('about.facts.items.woodworks.title'),
      description: t('about.facts.items.woodworks.description'),
    },
    {
      icon: <CloudSunIcon className='h-6 w-6' />,
      title: t('about.facts.items.climate.title'),
      description: t('about.facts.items.climate.description'),
    },
  ];

  return (
    <div className='animate-in fade-in duration-500'>
      {/* Page Header */}
      <ModuleHeader
        title={lguLabels.aboutLgu}
        description={t('about.hero.description')}
      />

      {/* Quick Facts */}
      <section className='mb-8'>
        <h3 className='text-kapwa-text-strong mb-4 text-lg font-bold'>
          {t('about.facts.title')}
        </h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {facts.map((fact, index) => (
            <Card key={index} className='border-kapwa-border-weak shadow-sm'>
              <CardContent className='p-5'>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-kapwa-bg-surface-brand text-kapwa-text-brand rounded-lg shrink-0'>
                    {fact.icon}
                  </div>
                  <div>
                    <h4 className='text-kapwa-text-strong text-sm font-semibold mb-1'>
                      {fact.title}
                    </h4>
                    <p className='text-kapwa-text-support text-xs leading-relaxed'>
                      {fact.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section className='mb-8'>
        <h3 className='text-kapwa-text-strong mb-4 text-lg font-bold'>
          {t('about.overview.title')}
        </h3>
        <div className='prose max-w-none'>
          {(
            t('about.overview.paragraphs', {
              returnObjects: true,
            }) as string[]
          ).map((paragraph: string, index: number) => (
            <p
              key={index}
              className='text-kapwa-text-support leading-relaxed mb-4 text-sm'
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Key Information */}
      <section className='mb-8'>
        <Card className='border-kapwa-border-weak shadow-sm'>
          <CardContent className='p-5'>
            <h3 className='text-kapwa-text-strong text-lg font-semibold mb-4'>
              {t('about.keyInformation.title')}
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {Object.keys(
                t('about.keyInformation.items', { returnObjects: true })
              ).map(key => (
                <div
                  key={key}
                  className='bg-kapwa-bg-surface-raised rounded-lg p-3'
                >
                  <div className='text-[10px] font-bold tracking-widest uppercase text-kapwa-text-disabled'>
                    {t(`about.keyInformation.items.${key}.label`)}
                  </div>
                  <div className='text-kapwa-text-strong text-sm font-medium mt-1'>
                    {t(`about.keyInformation.items.${key}.value`)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Related Links */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <Link to='/discover/history'>
          <Card
            hover
            className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:border-kapwa-border-brand transition-all'
          >
            <CardContent className='flex items-center justify-between p-4'>
              <span className='text-kapwa-text-strong text-sm font-semibold'>
                {t('about.relatedLinks.items.history')}
              </span>
              <ArrowRight className='text-kapwa-text-disabled h-4 w-4' />
            </CardContent>
          </Card>
        </Link>
        <Link to='/government/barangays'>
          <Card
            hover
            className='border-kapwa-border-weak bg-kapwa-bg-surface-raised hover:border-kapwa-border-brand transition-all'
          >
            <CardContent className='flex items-center justify-between p-4'>
              <span className='text-kapwa-text-strong text-sm font-semibold'>
                {t('about.relatedLinks.items.barangays')}
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
            <CardContent className='flex items-center justify-between p-4'>
              <span className='text-kapwa-text-strong text-sm font-semibold'>
                {t('about.relatedLinks.items.map')}
              </span>
              <ArrowRight className='text-kapwa-text-disabled h-4 w-4' />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AboutTaytay;
