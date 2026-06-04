import { useLocation } from 'react-router-dom';

import { PageHeader, SectionBlock, SuspenseOutlet } from '@/components/layout';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

import DiscoverSidebar from './components/DiscoverSidebar';

export default function DiscoverLayout() {
  const location = useLocation();
  const isMapRoute = location.pathname.endsWith('/map');

  // The map page renders fullscreen without layout chrome
  if (isMapRoute) {
    return <SuspenseOutlet />;
  }

  return (
    <div className='min-h-screen bg-kapwa-bg-surface'>
      <PageHeader
        variant='centered'
        title='Discover Taytay'
        description='Explore the rich history, vibrant culture, and local attractions of the Municipality of Taytay, Rizal — the Garments Capital of the Philippines.'
      />

      <SectionBlock>
        <SidebarLayout sidebar={<DiscoverSidebar />} collapsible={true}>
          <SuspenseOutlet />
        </SidebarLayout>
      </SectionBlock>
    </div>
  );
}
