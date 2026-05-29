import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPinIcon,
  UsersIcon,
  ShirtIcon,
  ScissorsIcon,
  CloudSunIcon,
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';

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
    <div className='min-h-screen bg-kapwa-bg-gray-default'>
      {/* Hero Section Banner */}
      <div className='relative h-[60vh] overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src='https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg'
            alt='Taytay Overview Landscape'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-kapwa-bg-surface-bold/50' />
        </div>
        <div className='relative h-full flex items-center'>
          <div className='container mx-auto px-4'>
            <div className='max-w-3xl'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-kapwa-text-inverse mb-6'>
                {t('about.hero.title')}
              </h1>
              <p className='text-xl text-kapwa-text-inverse/90 leading-relaxed'>
                {t('about.hero.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Quick Facts */}
          <div className='lg:col-span-2 space-y-8'>
            <section>
              <h2 className='text-3xl font-bold text-kapwa-text-strong mb-6'>
                {t('about.facts.title')}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {facts.map((fact, index) => (
                  <Card key={index}>
                    <CardContent className='p-6'>
                      <div className='flex items-start space-x-4'>
                        <div className='p-3 bg-kapwa-bg-surface-brand text-kapwa-text-brand rounded-lg'>
                          {fact.icon}
                        </div>
                        <div>
                          <h3 className='text-lg font-semibold text-kapwa-text-strong mb-2'>
                            {fact.title}
                          </h3>
                          <p className='text-kapwa-gray-800'>
                            {fact.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className='text-3xl font-bold text-kapwa-text-strong mb-6'>
                {t('about.overview.title')}
              </h2>
              <div className='prose max-w-none'>
                {(
                  t('about.overview.paragraphs', {
                    returnObjects: true,
                  }) as string[]
                ).map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className='text-kapwa-gray-800 leading-relaxed mb-4'
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </div>

          {/* Context Sidebar */}
          <div className='space-y-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold text-kapwa-text-strong mb-4'>
                  {t('about.keyInformation.title')}
                </h3>
                <div className='space-y-3'>
                  {Object.keys(
                    t('about.keyInformation.items', { returnObjects: true })
                  ).map(key => (
                    <div key={key}>
                      <div className='text-sm font-medium text-kapwa-gray-800'>
                        {t(`about.keyInformation.items.${key}.label`)}
                      </div>
                      <div className='text-kapwa-gray-900'>
                        {t(`about.keyInformation.items.${key}.value`)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Links */}
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold text-kapwa-text-strong mb-4'>
                  {t('about.relatedLinks.title')}
                </h3>
                <nav className='space-y-2'>
                  <a
                    href='/discover/history'
                    className='block px-4 py-2 text-kapwa-text-support rounded-md transition-colors hover:bg-kapwa-bg-gray-hover'
                  >
                    {t('about.relatedLinks.items.history')}
                  </a>
                  <a
                    href='/government/barangays'
                    className='block px-4 py-2 text-kapwa-text-support rounded-md transition-colors hover:bg-kapwa-bg-gray-hover'
                  >
                    {t('about.relatedLinks.items.barangays')}
                  </a>
                  <a
                    href='/discover/map'
                    className='block px-4 py-2 text-kapwa-text-support rounded-md transition-colors hover:bg-kapwa-bg-gray-hover'
                  >
                    {t('about.relatedLinks.items.map')}
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTaytay;
