import { useLocation } from 'react-router-dom';

import { SidebarLayout, SuspenseOutlet } from '@/components/layout';

import ElectedOfficialsSidebar from './components/ElectedOfficialsSidebar';

export default function ElectedOfficialsLayout() {
  const location = useLocation();

  // Logic: Collapse if not on the main index
  const isDeepPage = location.pathname !== '/government/elected-officials';

  return (
    <SidebarLayout
      sidebar={<ElectedOfficialsSidebar />}
      collapsible={true}
      defaultCollapsed={isDeepPage}
    >
      <SuspenseOutlet />
    </SidebarLayout>
  );
}
