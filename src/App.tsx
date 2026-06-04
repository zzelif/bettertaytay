import { lazy } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';

import { NuqsAdapter } from 'nuqs/adapters/react-router/v6';

import { Footer } from '@/components/layout/Footer';
// --- Layouts ---
import { Navbar } from '@/components/layout/Navbar';
import { HotlineBar } from '@/components/layout/HotlineBar';
import { SEO } from '@/components/layout/SEO';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import Ticker from '@/components/ui/Ticker';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { config } from '@/lib/lguConfig';
import 'leaflet/dist/leaflet.css';

const ContactUs = lazy(() => import('@/pages/ContactUs'));
const Discord = lazy(() => import('@/pages/Discord'));
const Home = lazy(() => import(/* @vite-preload */ '@/pages/Home'));
const Ideas = lazy(() => import('@/pages/Ideas'));
const JoinUs = lazy(() => import('@/pages/JoinUs'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const SearchPage = lazy(() => import('@/pages/Search'));
const Hotlines = lazy(() => import('@/pages/Hotlines'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const AboutPage = lazy(() => import('@/pages/about'));
const AccessibilityPage = lazy(() => import('@/pages/accessibility'));
const AdminAuditLog = lazy(() => import('@/pages/admin/AuditLog'));
const AdminDocuments = lazy(() => import('@/pages/admin/Documents'));
const AdminErrorLog = lazy(() => import('@/pages/admin/ErrorLog'));
const AdminReconcile = lazy(() => import('@/pages/admin/Reconcile'));
const AdminReviewQueue = lazy(() => import('@/pages/admin/ReviewQueue'));
const DeletionQueue = lazy(
  () => import('@/pages/admin/components/DeletionQueue')
);
const PersonMergeTool = lazy(
  () => import('@/pages/admin/components/PersonMergeTool')
);
const AdminDashboard = lazy(() => import('@/pages/admin/index'));
const AdminLayout = lazy(() => import('@/pages/admin/layout'));
const ForexPage = lazy(() => import('@/pages/data/forex'));
const WeatherPage = lazy(() => import('@/pages/data/weather'));
const BarangaysIndex = lazy(() => import('@/pages/government/barangays'));
const BarangayDetail = lazy(
  () => import('@/pages/government/barangays/[barangay]')
);
const BarangaysLayout = lazy(
  () => import('@/pages/government/barangays/layout')
);
const DepartmentsIndex = lazy(() => import('@/pages/government/departments'));
const DepartmentDetail = lazy(
  () => import('@/pages/government/departments/[department]')
);
const DepartmentsLayout = lazy(
  () => import('@/pages/government/departments/layout')
);
const TaytayMapPortal = lazy(() => import('@/pages/discover/map'));
const AboutTaytay = lazy(() => import('@/pages/discover/about'));
const HistoryPage = lazy(() => import('@/pages/discover/history'));
const CulturePage = lazy(() => import('@/pages/discover/culture'));
const TourismPage = lazy(() => import('@/pages/discover/tourism'));
const TravelIndex = lazy(() => import('@/pages/discover/travel'));
const VisaChecker = lazy(() => import('@/pages/discover/travel/visa'));
const DiscoverLayout = lazy(() => import('@/pages/discover/layout'));
const ElectedOfficialsIndex = lazy(
  () => import('@/pages/government/elected-officials')
);
const ElectedOfficialsLayout = lazy(
  () => import('@/pages/government/elected-officials/layout')
);
const MunicipalCommitteesPage = lazy(
  () => import('@/pages/government/elected-officials/municipal-committees')
);
const GovernmentRootLayout = lazy(() => import('@/pages/government/layout'));
const ReferenceImplementationPage = lazy(
  () => import('@/pages/government/reference-implementation')
);
const LegacyDocumentRedirect = lazy(
  () => import('@/pages/openlgu/LegacyDocumentRedirect')
);
const LegislationDetail = lazy(() => import('@/pages/openlgu/[document]'));
const PersonDetail = lazy(() => import('@/pages/openlgu/[person]'));
const SessionDetail = lazy(() => import('@/pages/openlgu/[session]'));
const TermDetail = lazy(() => import('@/pages/openlgu/[term]'));
const LegislationIndex = lazy(() => import('@/pages/openlgu/index'));
const OpenLGULayout = lazy(() => import('@/pages/openlgu/layout'));
const OfficialsIndex = lazy(() => import('@/pages/openlgu/officials'));
const TermsIndex = lazy(() => import('@/pages/openlgu/terms'));
const Services = lazy(() => import('@/pages/services'));
const ServiceDetail = lazy(() => import('@/pages/services/[service]'));
const ServicesLayout = lazy(() => import('@/pages/services/layout'));
const SitemapPage = lazy(() => import('@/pages/sitemap'));
const CompetitivenessPage = lazy(
  () => import('@/pages/statistics/CompetitivenessPage')
);
const MunicipalIncomePage = lazy(
  () => import('@/pages/statistics/MunicipalIncomePage')
);
const PopulationPage = lazy(() => import('@/pages/statistics/PopulationPage'));
const StatisticsLayout = lazy(() => import('@/pages/statistics/layout'));
const FinancialPage = lazy(() => import('@/pages/transparency/financial'));
const TransparencyIndex = lazy(() => import('@/pages/transparency/index'));
const InfrastructurePage = lazy(
  () => import('@/pages/transparency/infrastructure')
);
const InfrastructureDetail = lazy(
  () => import('@/pages/transparency/infrastructure/[project]')
);
const TransparencyLayout = lazy(() => import('@/pages/transparency/layout'));
const ProcurementPage = lazy(() => import('@/pages/transparency/procurement'));

function App() {
  return (
    <Router>
      <NuqsAdapter>
        <AppContent />
      </NuqsAdapter>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isMapRoute = location.pathname.endsWith('/map');

  return (
    <div className='flex flex-col min-h-screen'>
      <SEO />
      {!isAdminRoute && !isMapRoute && <HotlineBar />}
      {!isAdminRoute && !isMapRoute && <Navbar />}
      {!isAdminRoute && !isMapRoute && <Ticker />}
      <ScrollToTop />

      <Routes>
        {/* Standard Global Pages */}
        <Route
          path='/'
          element={
            <ErrorBoundary level='route' context='Home'>
              <Home />
            </ErrorBoundary>
          }
        />
        <Route
          path='/about'
          element={
            <ErrorBoundary level='route' context='About'>
              <AboutPage />
            </ErrorBoundary>
          }
        />
        <Route
          path='/contact'
          element={
            <ErrorBoundary level='route' context='Contact'>
              <ContactUs />
            </ErrorBoundary>
          }
        />
        <Route
          path='/accessibility'
          element={
            <ErrorBoundary level='route' context='Accessibility'>
              <AccessibilityPage />
            </ErrorBoundary>
          }
        />
        <Route
          path='/search'
          element={
            <ErrorBoundary level='route' context='Search'>
              <SearchPage />
            </ErrorBoundary>
          }
        />
        {config.features.hotlines && (
          <Route
            path='/hotlines'
            element={
              <ErrorBoundary level='route' context='Hotlines'>
                <Hotlines />
              </ErrorBoundary>
            }
          />
        )}
        <Route
          path='/ideas'
          element={
            <ErrorBoundary level='route' context='Ideas'>
              <Ideas />
            </ErrorBoundary>
          }
        />
        <Route
          path='/join-us'
          element={
            <ErrorBoundary level='route' context='JoinUs'>
              <JoinUs />
            </ErrorBoundary>
          }
        />
        <Route
          path='/terms-of-service'
          element={
            <ErrorBoundary level='route' context='TermsOfService'>
              <TermsOfService />
            </ErrorBoundary>
          }
        />
        <Route
          path='/sitemap'
          element={
            <ErrorBoundary level='route' context='Sitemap'>
              <SitemapPage />
            </ErrorBoundary>
          }
        />
        <Route path='/discord' Component={Discord} />

        {/* Data Utilities */}
        <Route
          path='/data/weather'
          element={
            <ErrorBoundary level='route' context='Weather'>
              <WeatherPage />
            </ErrorBoundary>
          }
        />
        <Route
          path='/data/forex'
          element={
            <ErrorBoundary level='route' context='Forex'>
              <ForexPage />
            </ErrorBoundary>
          }
        />

        {/* Discover Hub */}
        {config.features.discover && (
          <Route
            path='/discover'
            element={
              <ErrorBoundary level='route' context='Discover'>
                <DiscoverLayout />
              </ErrorBoundary>
            }
          >
            <Route index element={<Navigate to='about' replace />} />
            <Route path='about' element={<AboutTaytay />} />
            <Route path='history' element={<HistoryPage />} />
            <Route path='culture' element={<CulturePage />} />
            {config.features.tourism && (
              <Route path='tourism' element={<TourismPage />} />
            )}
            <Route path='travel' element={<TravelIndex />} />
            <Route path='travel/visa' element={<VisaChecker />} />
            <Route path='map' element={<TaytayMapPortal />} />
          </Route>
        )}

        {/* Services Module (Detail nested in Layout for Sidebar persistence) */}
        <Route
          path='/services'
          element={
            <ErrorBoundary level='route' context='Services'>
              <ServicesLayout />
            </ErrorBoundary>
          }
        >
          <Route index element={<Services />} />
          <Route path=':service' element={<ServiceDetail />} />
        </Route>

        {/* Government Directory Hub */}
        <Route
          path='/government'
          element={
            <ErrorBoundary level='route' context='Government'>
              <GovernmentRootLayout />
            </ErrorBoundary>
          }
        >
          <Route index element={<Navigate to='elected-officials' replace />} />

          {/* 1. Elected Officials */}
          <Route path='elected-officials' element={<ElectedOfficialsLayout />}>
            <Route index element={<ElectedOfficialsIndex />} />
            <Route path='committees' element={<MunicipalCommitteesPage />} />
          </Route>

          {/* 2. Municipal Departments */}
          <Route path='departments' element={<DepartmentsLayout />}>
            <Route index element={<DepartmentsIndex />} />
            <Route path=':department' element={<DepartmentDetail />} />
          </Route>

          {/* 3. Barangay Directory */}
          <Route path='barangays' element={<BarangaysLayout />}>
            <Route index element={<BarangaysIndex />} />
            <Route path=':barangay' element={<BarangayDetail />} />
          </Route>

          {/* 4. Reference Implementation */}
          <Route
            path='reference-implementation'
            element={<ReferenceImplementationPage />}
          />
        </Route>

        {/* Statistics Dashboard */}
        {config.features.statistics && (
          <Route
            path='statistics'
            element={
              <ErrorBoundary level='route' context='Statistics'>
                <StatisticsLayout />
              </ErrorBoundary>
            }
          >
            <Route index element={<PopulationPage />} />
            <Route path='population' element={<PopulationPage />} />
            <Route path='municipal-income' element={<MunicipalIncomePage />} />
            <Route path='competitiveness' element={<CompetitivenessPage />} />
          </Route>
        )}

        {/* OpenLGU Portal */}
        {config.features.openLGU && (
          <Route
            path='openlgu'
            element={
              <ErrorBoundary level='route' context='OpenLGU'>
                <OpenLGULayout />
              </ErrorBoundary>
            }
          >
            <Route index element={<LegislationIndex />} />
            <Route path='officials' element={<OfficialsIndex />} />
            <Route path='terms' element={<TermsIndex />} />
            {/* Legacy redirect for backward compatibility */}
            <Route
              path=':type/:document'
              element={<LegacyDocumentRedirect />}
            />
            {/* New unified document route */}
            <Route path='documents/:document' element={<LegislationDetail />} />
            <Route path='session/:sessionId' element={<SessionDetail />} />
            <Route path='person/:personId' element={<PersonDetail />} />
            <Route path='term/:termId' element={<TermDetail />} />
          </Route>
        )}

        {/* Transparency Portal */}
        {config.features.transparency && (
          <Route
            path='/transparency'
            element={
              <ErrorBoundary level='route' context='Transparency'>
                <TransparencyLayout />
              </ErrorBoundary>
            }
          >
            <Route index element={<TransparencyIndex />} />
            <Route path='financial' element={<FinancialPage />} />
            <Route path='procurement' element={<ProcurementPage />} />
            <Route path='/transparency/infrastructure'>
              <Route index element={<InfrastructurePage />} />
              <Route path=':contractId' element={<InfrastructureDetail />} />
            </Route>
          </Route>
        )}

        {/* Community Contribution Flow */}
        {/* <Route path='contribute' element={<ContributePage />} /> */}

        {/* Admin Routes */}
        <Route
          path='/admin'
          element={
            <ErrorBoundary level='route' context='Admin'>
              <AdminLayout />
            </ErrorBoundary>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path='documents' element={<AdminDocuments />} />
          <Route path='persons/merge' element={<PersonMergeTool />} />
          <Route path='persons/deletion-queue' element={<DeletionQueue />} />
          <Route path='errors' element={<AdminErrorLog />} />
          <Route path='audit-logs' element={<AdminAuditLog />} />
          <Route path='review-queue' element={<AdminReviewQueue />} />
          <Route path='reconcile' element={<AdminReconcile />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>

      {!isAdminRoute && !isMapRoute && <Footer />}
    </div>
  );
}

export default App;
