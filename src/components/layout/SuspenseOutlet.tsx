import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PageLoadingState } from '@/components/ui/Skeletons';

interface SuspenseOutletProps {
  context?: unknown;
}

export function SuspenseOutlet({ context }: SuspenseOutletProps) {
  return (
    <Suspense fallback={<PageLoadingState />}>
      <Outlet context={context} />
    </Suspense>
  );
}

