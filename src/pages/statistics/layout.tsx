import {
  PageHeader,
  SectionBlock,
  SidebarLayout,
  SuspenseOutlet,
} from '@/components/layout';

import StatisticsSidebar from './components/StatisticsSidebar';

export default function StatisticsLayout() {
  return (
    <div className='min-h-screen bg-kapwa-bg-surface'>
      <PageHeader
        variant='centered'
        title='Municipal Statistics'
        description='Data-driven insights into the population, economy, and performance of Taytay.'
      />

      <SectionBlock>
        <SidebarLayout sidebar={<StatisticsSidebar />} collapsible={true}>
          <SuspenseOutlet />
        </SidebarLayout>
      </SectionBlock>
    </div>
  );
}
